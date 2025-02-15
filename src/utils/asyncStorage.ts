import AsyncStorage from "@react-native-async-storage/async-storage";

export const setStorage = (key: string, data: any) => {
  if (JSON.stringify(data).length) {
    return new Promise(async (resolve, reject) => {
      await AsyncStorage.setItem(key, JSON.stringify(data))
        .then((res) => {
          resolve(res);
        })
        .catch((e) => {
          reject(e);
        });
    });
  }
};

export const getStorage = (key: string) => {
  return new Promise(async (resolve, reject) => {
    await AsyncStorage.getItem(key)
      .then((res) => {
        if (res?.length) {
          resolve(JSON.parse(res));
        } else {
          resolve(null);
        }
      })
      .catch((e) => {
        reject(e);
      });
  });
};
