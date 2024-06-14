interface Result {
  status: number;
  message: string;
  result: any;
}

// Request response parameters (including data)
interface ResultData<T = any> extends Result {
  data: T;
}

declare namespace Login {
  interface sendCodeReq {
    identifier: string;
    countrycode: string;
    type: string;
  }
  interface loginReq {
    identifier: string;
    code: string;
    type: string;
  }
  interface loginRes {
    id: string;
    name: string;
    email: string;
    metamask: string;
    insertedAt: string;
    updatedAt: string;
    created: boolean;
    token: string;
  }
}

declare namespace Shop {
  interface creatOrderReq {
    scenariocode: number;
    method: number;
    id: number;
  }
  interface goodsList {
    id: number;
    description: string;
    time: number;
    currency: string;
    fee: number;
    special: number;
  }
}

interface PageRes<T> {
  count: string;
  list: T[];
}

interface speech2text {
  filename: string;
  fromlanguage: string;
  tolanguage: string;
  language: string;
}

interface text2speech {
  text: string;
  language: string;
  speed: number;
  voice: string;
}

interface first_read {
  id: number;
  day: string;
  title: string;
  review: string[];
  keyword: string[];
  content: string[];
}

interface zhongkao_sentence {
  id: number;
  Sentenc: number;
  topic: string;
  content: {
    Sentence: number;
    word_en: string;
    phonetic_en?: string;
    "n."?: string;
    word_cn: string;
  }[];
}

interface chooseOptions_lesson {
  lesson: number;
  topic: string;
  content: chooseOptions[];
}

interface chooseOptions {
  t_id: number;
  word_en: string;
  word_zh: string;
  options: {
    en: string;
    zh: string;
  }[];
  active: number;
}

interface daily_word {
  id: number;
  active: boolean;
  word_zh: string;
  word_en: string;
  phonetic_en: string;
}

interface listen_mp3 {
  id: number;
  mp3: string;
  questions: {
    id: number;
    question: string;
    correctAnswer: string;
    answers: string[];
    active: number;
    options: {
      word_en: string;
    }[];
  }[];
}

interface coursesLevel {
  level: number;
  courses: {
    id: number;
    progress: CourseProgress;
  }[];
}

enum CourseProgress {
  UnPass = -1,
  UnStart = 0,
  Pass = 1,
}
