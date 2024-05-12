export enum ExamType {
  ZHONGKAO = "zk",
  GAOKAO = "gk",
  IELTS = "ielts",
}

export const formatExamType = (type: ExamType | undefined) => {
  switch (type) {
    case ExamType.ZHONGKAO:
      return "中考";
    case ExamType.GAOKAO:
      return "高考";
    case ExamType.IELTS:
      return "雅思";
    default:
      return "中考";
  }
};
