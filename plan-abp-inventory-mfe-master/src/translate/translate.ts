import _ from 'lodash';

const translate = (i18n: any) => {
  const availableLanguages = ['de', 'en'];
  // fallback to en if language not available
  const lan = availableLanguages.includes(i18n.language) ? i18n.language : 'en';

  const mapping = i18n.getDataByLanguage(lan);
  interface StringMap {
    [key: string]: any;
  }
  const result: StringMap = {};
  if (mapping) {
    for (let namespace in mapping) {
      for (let key in mapping[namespace]) {
        _.set(result, `${namespace}.${key}`, mapping[namespace][key]);
      }
    }
  }
  return result;
};

export default translate;
