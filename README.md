# filter-component
JS filter

Результат выводится в консоль.

https://anastasiaval.github.io/filter-component/

Компонент состоит из инпутов для ввода данных и кнопок Add condition, Apply и Clear filter.

При клике на первый инпут появляется выпадашка с возможностью выбора поля фильтрации. При выборе второго инпута появлятся выпадашка с возможностью выбора операции фильтрации.

В последний инпут вводится значение фильтра. Для Text field фильтра это текст, для Number field это число. При изменении поля фильтрации с Text field на Number field или наоборот, остальные инпуты (операция и значение фильтрации) сбрасываются на дефолтные.

При клике на Add condition появляется новая строка с инпутами. Дефолтное состояние новой строки фильтра — тип фильтра Text, операция Containing.

Максимальное количество строк — 10. Если строк больше одной, в конце каждой из них появляется кнопка X, удаляющая данную строку.

При нажатии кнопки Clear filter весь компонент скидывается в первоначальное состояние.

При нажатии кнопки Apply в консоль браузера выводится информация о текущем состоянии фильтра.