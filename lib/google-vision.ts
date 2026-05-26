import * as FileSystem from 'expo-file-system/legacy';

interface FoodRecognitionResult {
  name: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  confidence: number;
}

// Convert image to base64
export const imageToBase64 = async (imageUri: string): Promise<string> => {
  try {
    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return base64;
  } catch (error) {
    console.error('Error converting image to base64:', error);
    throw error;
  }
};

// Recognize food using Claude AI (via Anthropic API)
export const recognizeFoodFromImage = async (imageUri: string): Promise<FoodRecognitionResult | null> => {
  try {
    const base64Image = await imageToBase64(imageUri);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-opus-4-5',
        max_tokens: 500,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: 'image/jpeg',
                  data: base64Image,
                },
              },
              {
                type: 'text',
                text: `Ты нутрициолог. Проанализируй это фото еды и определи:
1. Название блюда (на русском)
2. Примерные калории на порцию
3. Белки (г)
4. Жиры (г)
5. Углеводы (г)

Отвечай ТОЛЬКО в формате JSON без markdown:
{"name":"название","calories":число,"protein":число,"fat":число,"carbs":число}`,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || '';

    // Parse JSON response
    const clean = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);

    return {
      name: parsed.name || 'Блюдо',
      calories: Number(parsed.calories) || 300,
      protein: Number(parsed.protein) || 15,
      fat: Number(parsed.fat) || 10,
      carbs: Number(parsed.carbs) || 35,
      confidence: 0.9,
    };
  } catch (error) {
    console.error('Error recognizing food:', error);
    // Fallback
    return {
      name: 'Неизвестное блюдо',
      calories: 300,
      protein: 15,
      fat: 10,
      carbs: 35,
      confidence: 0.5,
    };
  }
};

export const getFoodNutrition = (foodName: string): FoodRecognitionResult | null => null;
