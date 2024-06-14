# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
// 合并基础课程仔细听数组
function mergeByDay(arr) {
  const mergedArr = [];

  // 遍历输入数组
  arr.forEach((item) => {
    // 检查是否已经有相同天数的对象存在于合并数组中
    const existingDay = mergedArr.find((elem) => elem.lesson === item.lesson);

    if (existingDay) {
      // 如果存在相同天数的对象，则将当前项添加到该天数的内容数组中
      existingDay.content.push({
        t_id: item.t_id,
        word_en: item.word_en,
        word_zh: item.word_zh,
        err_en: [...item.err_en.split("|"), item.word_en],
        err_zh: [...item.err_zh.split("|"), item.word_zh],
      });
    } else {
      // 如果不存在相同天数的对象，则创建一个新的对象并添加到合并数组中
      mergedArr.push({
        lesson: item.lesson,
        topic: item.topic,
        content: [
          {
            t_id: item.t_id,
            word_en: item.word_en,
            word_zh: item.word_zh,
            err_en: [...item.err_en.split("|"), item.word_en],
            err_zh: [...item.err_zh.split("|"), item.word_zh],
          },
        ],
      });
    }
  });
  console.log(mergedArr);
  return mergedArr;
}
// 合并选项
const newData = oldData.map((item) => {
  return {
    ...item,
    content: item.content.map((it) => {
      return {
        ...it,
        options: it.err_en.map((_, i) => {
          return {
            en: it.err_en[i],
            zh: it.err_zh[i],
          };
        }),
      };
    }),
  };
});
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
