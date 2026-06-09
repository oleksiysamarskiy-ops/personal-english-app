// Translator utility
// Currently uses a local stub. To switch to OpenAI API, replace the
// translateWord function body with an actual API call and keep the
// same return shape: { translation: string; meaning: string }
//
// Example OpenAI integration:
// export async function translateWord(text: string): Promise<TranslationResult> {
//   const response = await fetch('https://api.openai.com/v1/chat/completions', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_KEY}`,
//     },
//     body: JSON.stringify({
//       model: 'gpt-4o-mini',
//       messages: [{ role: 'user', content:
//         `Translate the English word/phrase "${text}" to Russian.
//          Respond ONLY with JSON: {"translation":"...","meaning":"..."}
//          where meaning is a short definition in Russian.` }],
//       response_format: { type: 'json_object' },
//     }),
//   });
//   const data = await response.json();
//   return JSON.parse(data.choices[0].message.content);
// }

export interface TranslationResult {
  translation: string;
  meaning: string;
}

const STUB_DICT: Record<string, TranslationResult> = {
  hello: { translation: 'привет', meaning: 'используется для приветствия людей' },
  world: { translation: 'мир', meaning: 'планета Земля или всё человечество' },
  apple: { translation: 'яблоко', meaning: 'сочный фрукт, который растёт на яблоне' },
  book: { translation: 'книга', meaning: 'набор страниц с текстом или иллюстрациями' },
  water: { translation: 'вода', meaning: 'прозрачная жидкость, необходимая для жизни' },
  sun: { translation: 'солнце', meaning: 'звезда в центре нашей солнечной системы' },
  house: { translation: 'дом', meaning: 'здание, в котором живут люди' },
  cat: { translation: 'кот', meaning: 'домашнее животное семейства кошачьих' },
  dog: { translation: 'собака', meaning: 'домашнее животное, преданный спутник человека' },
  time: { translation: 'время', meaning: 'непрерывное течение событий от прошлого к будущему' },
  love: { translation: 'любовь', meaning: 'глубокая привязанность или сильное чувство к кому-либо' },
  friend: { translation: 'друг', meaning: 'человек, с которым у вас близкие дружеские отношения' },
  work: { translation: 'работа', meaning: 'деятельность с целью заработка или достижения цели' },
  learn: { translation: 'учиться', meaning: 'приобретать знания или навыки через опыт или обучение' },
  speak: { translation: 'говорить', meaning: 'произносить слова вслух для общения' },
  read: { translation: 'читать', meaning: 'воспринимать написанный или напечатанный текст' },
  write: { translation: 'писать', meaning: 'создавать текст с помощью букв или символов' },
  think: { translation: 'думать', meaning: 'использовать разум для рассуждения или размышления' },
  know: { translation: 'знать', meaning: 'иметь информацию или осведомлённость о чём-либо' },
  go: { translation: 'идти', meaning: 'перемещаться или двигаться в определённом направлении' },
  good: { translation: 'хороший', meaning: 'имеющий положительные качества или свойства' },
  bad: { translation: 'плохой', meaning: 'имеющий отрицательные качества; неприятный' },
  big: { translation: 'большой', meaning: 'значительный по размеру, объёму или количеству' },
  small: { translation: 'маленький', meaning: 'незначительный по размеру или количеству' },
  run: { translation: 'бежать', meaning: 'перемещаться быстрым шагом, отрывая обе ноги от земли' },
  eat: { translation: 'есть', meaning: 'употреблять пищу, поглощать еду' },
  sleep: { translation: 'спать', meaning: 'находиться в состоянии сна и отдыха' },
  help: { translation: 'помогать', meaning: 'оказывать содействие или поддержку кому-либо' },
  play: { translation: 'играть', meaning: 'участвовать в игре или развлекательной деятельности' },
  make: { translation: 'делать', meaning: 'создавать или производить что-либо' },
};

export async function translateWord(text: string): Promise<TranslationResult> {
  await new Promise((r) => setTimeout(r, 350));
  const key = text.trim().toLowerCase();
  const found = STUB_DICT[key];
  if (found) return found;
  return {
    translation: `[${text}]`,
    meaning: `английское слово или фраза: "${text}"`,
  };
}
