# Value_Secrets
## Описание
Простейший чат с возможностью шифровать переписку
## Запуск
+ Скачайте архив
+ Запустите и настройте MongoDB
+ Пропишите в config данные для подключения к mongo
+ Запустите эти команды в терминале из дериктории проекта
    npm install -D
    npm start

## Использование
Приложение запустится на 3000 порту. Для использования чата необходимо зарегестрироваться в системе. При регистрации система запросит уникальный логин, ник и пароль. После регестрации пользователь подключается к начальной комнате. 
Для смены комнаты нужно нажать кнопку **JOIN** и ввести название комнаты. Если комната шифруется, то один из участиников должен одобрить ваше присоединение.
Для смены аватарки нужно нажать на картинку в верхнем левом углу экрана и выбрать новое изображение из файлов на компьютере (.jpg, .jpeg, .png).
Для смены ника нужно нажать на значок редактирования рядом с ником в верхнем левом углу экрана
Для создания комнаты нужно нажать на кнопку **CREATE** при этом с помощью чекбокса надо выбрать будет ли шифроваться данная комната.


