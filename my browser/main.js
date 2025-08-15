// Импортируем модули из Electron
const { app, BrowserWindow, ipcMain } = require("electron");
// Импортируем модуль path для работы с файловыми путями
const path = require("path");
// Переменная для хранения ссылки на главное окно приложения
let mainWindow;
// Функция для создания главного окна приложения
function createWindow() {
 // Создаём новое окно браузера с заданными параметрами
 mainWindow = new BrowserWindow({
   // Ширина окна
   width: 800,
   // Высота окна
   height: 600,
   webPreferences: {
     // Подключаем preload.js для безопасного взаимодействия
     preload: path.join(__dirname, "preload.js"),
     // Включаем изоляцию контекста для безопасности

     contextIsolation: true,
     // Отключаем удалённый модуль для дополнительной безопасности

     enableRemoteModule: false,
   },
 });

 // Загружаем файл index.html в окно
 mainWindow.loadFile("index.html");
 // Отображаем окно, когда оно будет готово
 mainWindow.once("ready-to-show", () => {
   mainWindow.show();
 });
 // Обрабатываем событие открытия URL из рендер-процесса
 ipcMain.on("open-url", (event, url) => {
   // Загружаем указанный URL в текущее окно
   mainWindow.loadURL(url);
 });
}
// Событие "ready" возникает, когда Electron готов создавать окна
app.on("ready", createWindow);
// Закрываем приложение, если все окна закрыты, кроме macOS
app.on("window-all-closed", () => {
 if (process.platform !== "darwin") {
   // Завершаем работу приложения
   app.quit();
 }
});
// Восстанавливаем окно, если приложение активируется без открытых окон
app.on("activate", () => {
 if (BrowserWindow.getAllWindows().length === 0) {
   // Создаём новое окно, если нет открытых окон
   createWindow();
 }
});