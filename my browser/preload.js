// Импортируем нужные модули из Electron
const { contextBridge, ipcRenderer } = require("electron");
// Используем contextBridge для безопасного взаимодействия между рендер-процессом и основным процессом
contextBridge.exposeInMainWorld("electronAPI", {
 // Создаём функцию openURL, доступную в рендер-процессе, которая отправляет сообщение в основной процесс
 openURL: (url) => ipcRenderer.send("open-url", url),
});