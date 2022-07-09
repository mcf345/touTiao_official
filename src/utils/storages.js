// 获取数据
export function getLocal(key) {
  let data = localStorage.getItem(key);

  try {
    return JSON.parse(data);
  } catch (e) {
    console.log(e);
  }
}

export function setLocal(key, data) {
  localStorage.setItem(
    key,
    typeof data === "object" ? JSON.stringify(data) : data
  );
}
