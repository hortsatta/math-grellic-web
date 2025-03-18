import { getImageSrcs } from '#/utils/html.util';
import { ExActTextType } from '#/core/models/core.model';

import type { ExamQuestionFormData } from '../models/exam-form-data.model';

export const defaultQuestion = {
  text: '',
  textType: ExActTextType.Text,
  choices: Array.from(Array(4), () => ({
    text: '',
    textType: ExActTextType.Text,
    isCorrect: false,
  })) as any[],
} as any;

export async function generateImageFormData(
  orderNumber: number,
  questions: ExamQuestionFormData[],
): Promise<FormData> {
  const formData = new FormData();
  const files: { base64: string; filename: string }[] = [];
  const baseName = `e${orderNumber}`;
  const fileExt = 'png';

  // Add all image srcs from question to files array
  for (const question of questions) {
    const srcs = await getImageSrcs(question.text);
    srcs.forEach((src, index) => {
      const filename = `${baseName}-q${question.orderNumber}-${index}.${fileExt}`;
      files.push({ base64: src, filename });
    });

    // Add all image srcs from choices to files array
    for (const choice of question.choices) {
      const srcs = await getImageSrcs(choice.text);
      srcs.forEach((src, index) => {
        const filename = `${baseName}-q${question.orderNumber}-c${choice.orderNumber}-${index}.${fileExt}`;
        files.push({ base64: src, filename });
      });
    }
  }

  // Convert base64 to blob and append files to formData
  for (const { base64, filename } of files) {
    const blob = await (await fetch(base64)).blob();
    formData.append('files', blob, filename);
  }

  return formData;
}
