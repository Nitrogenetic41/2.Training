window.addEventListener('DOMContentLoaded', () => {//назначили глобальный обработчик событий
    //1. нужно создать функцию которая будет скрывать табы 2. показать нужный таб 3. назначить обработчики событий на меню которое будет манипулировать этими функциями
    
    //TABS
    const tabs = document.querySelectorAll('.tabheader__item'),//табы на которые будем кликать
        tabsContent = document.querySelectorAll('.tabcontent'),//контент в верстке
        tabsParent = document.querySelector('.tabheader__items');//родитель который будет содержать все табы

    function hideTabContent () {//скрываем контент табов
        tabsContent.forEach(item => {//скрываем элементы табов
            // item.style.display = 'none';//скрыли (убрали после добавления класслиста ниже **)
            item.classList.add('hide');//**добавляем один класс
            item.classList.remove('show', 'fade');//**удаляем другой класс
        });
        
        tabs.forEach(item => {//также убираем класс активности у каждого таба
            item.classList.remove('tabheader__item_active');
        });
    }

    function showTabContent (i = 0) {//функция которая будет показывать нам табы
        // tabsContent[i].style.display = 'block';//добавляем табу стиль(убрали после добавления класслиста ниже **)
        tabsContent[i].classList.add('show', 'fade');//**
        tabsContent[i].classList.remove('hide');//**
        tabs[i].classList.add('tabheader__item_active');//добавляем класс активности табу
    }

    hideTabContent();//пишем выводы функций
    showTabContent();//что бы не писать номер элемента(0), в аргумент вывода функции, можно добавить в конструкции значение по дефолту  (i = 0)

    tabsParent.addEventListener('click', (event) => {//назначили обработчик событий
        const target = event.target;//использовали что бы часто не писать event.target

        if (target && target.classList.contains('tabheader__item')) {//используем делегирование событий
            tabs.forEach ((item, i) => {
                if (target == item) {//т.е тот элемент на который кликнули target будет совпадать с элементом который перебираем item то будут вызываться 2 функции (ниже)
                    hideTabContent();
                    showTabContent(i);
                }//когда кликаем в определенный пункт таба, мы должны определить его номер в списке всех табов,и по этому номеру вызвать нашу функцию showTabContent
            });
        }
    });
    
    //TIMER
    const deadline = '2021-12-19';

    function getTimeRemaining(endtime) {
        const t = Date.parse(endtime) - Date.parse(new Date()),
            days = Math.floor( (t/(1000*60*60*24)) ),
            seconds = Math.floor( (t/1000) % 60 ),
            minutes = Math.floor( (t/1000/60) % 60 ),
            hours = Math.floor( (t/(1000*60*60) % 24) );

        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }

    function getZero(num){
        if (num >= 0 && num < 10) { 
            return '0' + num;
        } else {
            return num;
        }
    }

    function setClock(selector, endtime) {

        const timer = document.querySelector(selector),
            days = timer.querySelector("#days"),
            hours = timer.querySelector('#hours'),
            minutes = timer.querySelector('#minutes'),
            seconds = timer.querySelector('#seconds'),
            timeInterval = setInterval(updateClock, 1000);

        updateClock();

        function updateClock() {
            const t = getTimeRemaining(endtime);

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if (t.total <= 0) {
                clearInterval(timeInterval);
            }
        }
    }

    setClock('.timer', deadline);

    //MODAL WINDOW
    const modalTrigger = document.querySelectorAll('[data-modal]'),
        modal = document.querySelector('.modal'),
        modalCloseBtn = document.querySelector('[data-close]');

    function openModal() {
        modal.classList.add('show');
        modal.classList.remove('hide');
        // Либо вариант с toggle - но тогда назначить класс в верстке
        document.body.style.overflow = 'hidden';
        clearInterval(modalTimerId);
    }
    
    modalTrigger.forEach(btn => {
        btn.addEventListener('click', openModal);
         
    });

    function closeModal() {
        modal.classList.add('hide');
        modal.classList.remove('show');
        // Либо вариант с toggle - но тогда назначить класс в верстке
        document.body.style.overflow = '';
    }
    
    modalCloseBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === "Escape" && modal.classList.contains('show')) { 
            closeModal();
        }
    });

    const modalTimerId = setTimeout(openModal, 300000);

    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight -1) {
            openModal();
            window.removeEventListener('scroll', showModalByScroll);
        }
    }

    window.addEventListener('scroll', showModalByScroll);

    //КЛАССЫ ДЛЯ КАРТОЧЕК МЕНЮ

    class MenuCard {
        constructor(src, alt, title, descr, price, parentSelector) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.parent = document.querySelector(parentSelector);
            this.transfer = 27;
            this.changeToUAH(); 
        }

        changeToUAH() {
            this.price = this.price * this.transfer; 
        }

        render() {
            const element = document.createElement('div');
            element.innerHTML = `
                <div class="menu__item">
                    <img src=${this.src} alt=${this.alt}>
                    <h3 class="menu__item-subtitle">${this.title}</h3>
                    <div class="menu__item-descr">${this.descr}</div>
                    <div class="menu__item-divider"></div>
                    <div class="menu__item-price">
                        <div class="menu__item-cost">Цена:</div>
                        <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                    </div>
                </div>
            `;
            this.parent.append(element);
        }
    }

    new MenuCard(
        "img/tabs/vegy.jpg",
        "vegy",
        'Меню "Фитнес"',
        'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
        9,
        ".menu .container"
    ).render();

    new MenuCard(
        "img/tabs/post.jpg",
        "post",
        'Меню "Постное"',
        'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
        14,
        ".menu .container"
    ).render();

    new MenuCard(
        "img/tabs/elite.jpg",
        "elite",
        'Меню “Премиум”',
        'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
        21,
        ".menu .container"
    ).render();
});

//ДОБАВИЛИ CSS АНИМАЦИЮ В ФАЙЛ СТИЛЕЙ, И ПРОПИСАЛИ ДЕЙСТВИЯ **
//.show{display:block}.hide{display:none}.fade{animation-name: fade;animation-duration: 1.5s;}@keyframes fade{from{opacity: 0.1;}to{opacity: 1;}}  
//show-добавляет поведение display block элемент показывается    hide-скрывает элементы    fade- переключение ,анимация css @keyframes fade{from{opacity: 0.1;}to{opacity: 1;}}  прозрачность от 10% до 100%






