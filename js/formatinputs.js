import {priceFormatter, priceFormatterDecimals} from './formatters.js'

const maxPrice = 100000000;

// Инпуты
const inputCost = document.querySelector('#input-cost');
const inputDownPayment = document.querySelector('#input-downpayment');
const inputTerm = document.querySelector('#input-term');

const form = document.querySelector('#form');
const totalCost = document.querySelector('#total-cost');
const totalMonthPayment = document.querySelector('#total-month-payment');

// Cleave опция форматирования
const cleavePriceSetting = {
        numeral: true,
        numeralThousandsGroupStyle: 'thousand',
        delimiter: ' '
};



const cleavePriceSettingRUB = {
    numeral: true,
    numeralThousandsGroupStyle: 'thousand',
    delimiter: ' ',
    prefix: '₽',
    tailPrefix: true,
};

// Запускаем форматирование Cleave
const cleaveCost = new Cleave(inputCost, cleavePriceSetting);
const cleaveDownPayment = new Cleave(inputDownPayment, cleavePriceSetting);
const cleaveTerm = new Cleave(inputTerm, cleavePriceSetting);

 // сумма кредита    
 calcMortgage();

// Отображение и рассчет суммы кредита 
form.addEventListener('input',function () {
 // сумма кредита    
 calcMortgage();
})
   
// рассчет суммы кредита
 
function calcMortgage() {
console.log('start');
    // Проверка чтобы стоимость недвижимости не была больше максимальной

          let cost = +cleaveCost.getRawValue();
          if (cost > maxPrice) {
          cost = maxPrice;
        }

    // общая сумма кредита
    const totalAmount = cost - cleaveDownPayment.getRawValue();
    totalCost.innerText = priceFormatter.format(totalAmount);   
    
 // ставка по кредиту   
const creditRate = +document.querySelector('input[name="program"]:checked').value;
const monthRate = (creditRate * 100) / 12; 

// общая суммв займа - Sz, количество месяцев - n, процентная ставка за год, разделенная на двенадцать месяцев - r

// срок ипотеки в годах 

const years = +cleaveTerm.getRawValue();

 

//const mortgageTermYears = document.querySelector('#input-term').value;

// срок ипотеки в месяцах

const months = years * 12;

// рассчет ежемесячного платежа
const monthPayment = (totalAmount * monthRate)/ (1 - (1+monthRate) * (1 - months));

// отображение ежемесячного платежа 
totalMonthPayment.innerText = priceFormatterDecimals.format(monthPayment);


}
// Слайдер кост sliderCost
const sliderCost = document.getElementById('slider-cost');

noUiSlider.create(sliderCost, {
    start: 10000000,
    connect: 'lower',
    //tooltips: true,
    step: 100000,
    range: {
        'min': 0,
        '50%' : [10000000, 1],
        'max': 100000000
    },

    format: wNumb({
        decimals: 0,
        thousand: ' ',
        suffix: '',
    })
});

sliderCost.noUiSlider.on('slide', function() {
    const sliderValue = parseInt (sliderCost.noUiSlider.get(true));
    cleaveCost.setRawValue(sliderValue);
   
    calcMortgage();


});

// Slider Downpayment
const sliderDownpayment = document.getElementById('slider-downpayment');

noUiSlider.create(sliderDownpayment, {
    start: 6000000,
    connect: 'lower',
    //tooltips: true,
    step: 100000,
    range: {
        'min': 0,
        'max': 10000000,
    },

    format: wNumb({
        decimals: 0,
        thousand: ' ',
        suffix: '',
    })
});

sliderDownpayment.noUiSlider.on('slide', function() {
    const sliderValue = parseInt (sliderDownpayment.noUiSlider.get(true));
    cleaveDownPayment.setRawValue(sliderValue);
   
    calcMortgage();


});

// Slider Term (Years) 

const sliderTerm = document.getElementById('slider-term');
noUiSlider.create(sliderTerm, {
    start: 1,
    connect: 'lower',
    //tooltips: true,
    step: 1,
    range: {
        'min': 1,
        'max': 30,
    },

    format: wNumb({
        decimals: 0,
        thousand: '',
        suffix: '',
    })
});

sliderTerm.noUiSlider.on('slide', function() {
    const sliderValue = parseInt (sliderTerm.noUiSlider.get(true));
    cleaveTerm.setRawValue(sliderValue);
    calcMortgage();

});

// форматирование InputCost

inputCost.addEventListener('input', function () {
    const value = +cleaveCost.getRawValue();
// Обновляем range slider
sliderCost.noUiSlider.set(value);


// Проверки на макс цену
        if (value > maxPrice) { 
           inputCost.closest('.param__details').classList.add('param__details--error');
        }
    
        if (value <= maxPrice) { 
            inputCost.closest('.param__details').classList.remove('param__details--error');
         }
    // Зависимость значений downPayment  от input cost
const percentMin = value * 0.15;
const percentMax = value * 0.90;


sliderDownpayment.noUiSlider.updateOptions({
        range: {
            'min': percentMin,
            'max': percentMax,
        },
    });
});

inputCost.addEventListener('change', function () {
const value = +cleaveCost.getRawValue();

   
    if (value > maxPrice) { 
        inputCost.closest('.param__details').classList.remove('param__details--error');
        cleaveCost.setRawValue(maxPrice);
    }
});



