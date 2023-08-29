export const loadTextFile = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    const input = document.createElement("input");
    input.type = "file";
    Object.assign(input.style, {
      visibility: "hidden",
      width: 0,
      height: 0,
      overflow: "hidden",
      position: "absolute",
    });
    const handler = () => {
      input.removeEventListener("change", handler);
      document.body.removeChild(input);
      if (input.value && input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) {
            resolve(reader.result.toString());
          }
        };
        reader.readAsText(input.files[0]);
      } else {
        reject();
      }
    };
    document.body.appendChild(input);
    input.addEventListener("change", handler);
    input.click();
  });
};
