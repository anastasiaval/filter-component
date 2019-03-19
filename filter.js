'use strict';

class Filter {

    constructor(settings) {
        this.settings = settings;
        this.defaultCondition = null; // default condition html
        this.conditionsCount = 0; // number of conditions
        this.conditions = {
            text: [],
            number: [],
        }; // result
    }

    init() {
        let filterContainer = document.getElementById(`${this.settings.filterContainerId}`);
        filterContainer.innerHTML = this.render();
        this.addEvents();
    }

    render() {
        let result = `<form class="${this.settings.formClasses.join(' ')}">
                          <div id="conditionsContainer">`;
        result += this.renderDefaultCondition();
        result += `</div>
                   <button type="button" class="addCondition ${this.settings.buttonAddClasses.join(' ')}">
                       + Add condition</button>
                   <hr>
                   <div class="${this.settings.buttonsContainerClasses.join(' ')}">
                        <button type="button" class="applyButton ${this.settings.buttonApplyClasses.join(' ')}">
                            Apply</button>
                        <button type="button" class="clearFilterButton ${this.settings.buttonClearFilterClasses
                            .join(' ')}">Clear Filter</button>
                   </div>
                   </form>`;
        return result;
    }

    renderDefaultCondition() {
        if (!this.defaultCondition) {
            this.defaultCondition = `<div class="${this.settings.inputContainerClasses.join(' ')}">
                                         <select class="field ${this.settings.inputClasses.join(' ')}">`;
            for (let i in this.settings.values) {
                let defaultSelected = '';
                if (i === this.settings.defaultField) {
                    defaultSelected = 'selected';
                }
                let content = i.charAt(0).toUpperCase() + i.substr(1); // make first letter capital
                this.defaultCondition += `<option value="${i}" ${defaultSelected}>${content} field</option>`;
            }
            this.defaultCondition += `</select>
                                          <select class="operation ${this.settings.inputClasses.join(' ')}">`;
            this.defaultCondition += this.renderSelectOptions(this.settings.defaultField);
            this.defaultCondition += `</select>
                                      <input type="text" class="input ${this.settings.inputClasses.join(' ')}">
                                      <span class="remove-icon hidden"></span></div>`;
        }

        return this.defaultCondition;
    }

    //render options for .operation select
    renderSelectOptions(field) {
        let result = '';
        for (let i of this.settings.values[field]) {
            let content = i.charAt(0).toUpperCase() + i.substr(1);
            result += `<option value="${i}">${content}</option>`;
        }
        return result;
    }

    addEvents() {
        this.addConditionEvents();
        this.addButtonsEvents();
    }

    addConditionEvents() {
        this.conditionsCount++;
        this.conditionsCountCheck();

        // change field
        let lastCondition = document.getElementById('conditionsContainer').lastChild;
        lastCondition.querySelector('.field').addEventListener('change', (e) =>
        lastCondition.querySelector('.operation').innerHTML = this.renderSelectOptions(e.target.value));

        // remove condition (x)
        lastCondition.querySelector('.remove-icon').addEventListener('click', () => {
            document.getElementById('conditionsContainer').removeChild(lastCondition);
            this.conditionsCount--;
            this.conditionsCountCheck();
        });
    }

    conditionsCountCheck () {
        if (this.conditionsCount === 1) {
            document.querySelector('.remove-icon').classList.add('hidden'); // hides x
        }
        if (this.conditionsCount === this.settings.maxNumberOfStrings - 1) {
            document.querySelector('.addCondition').classList.remove('hidden'); // shows +add
        }
        if (this.conditionsCount === this.settings.maxNumberOfStrings) {
            document.querySelector('.addCondition').classList.add('hidden'); // removes +add
        }
        if (this.conditionsCount > 1) {
            let removeIcons = document.querySelectorAll('.remove-icon'); // shows x
            for (let i = 0; i < removeIcons.length; i++) {
                removeIcons[i].classList.remove('hidden');
            }
        }
    }

    addButtonsEvents() {
        // +Add button
        document.querySelector('.addCondition').addEventListener('click', () => {
            this.addCondition();
        });

        // Apply button
        document.querySelector('.applyButton').addEventListener('click', () => {
            this.removeErrors();
            this.conditions.text = [];
            this.conditions.number = [];
            if (this.inputValidation()) {
                console.log(JSON.stringify(this.conditions, null, 4));
            } else console.error('Input error.');
        });

        //Clear button
        document.querySelector('.clearFilterButton').addEventListener('click', () => {
            document.getElementById('conditionsContainer').innerHTML = '';
            this.conditionsCount = 0;
            this.addCondition();
        });
    }

    addCondition () {
        document.getElementById('conditionsContainer').insertAdjacentHTML('beforeend' ,this.defaultCondition);
        this.addConditionEvents();
    }

    // boolean
    inputValidation() {
        let container = document.getElementById('conditionsContainer').childNodes;

        let result = true;

        for (let condition of container) {
            if (condition.querySelector('.input').value) {
                if (condition.querySelector('.field').value === 'text') {
                    if (!this.inputTextValidator(condition.querySelector('.input'))) {
                        result = false;
                    } else {
                        this.resultRender(condition);
                    }
                }
                if (condition.querySelector('.field').value === 'number') {
                    if (!this.inputNumberValidator(condition.querySelector('.input'))) {
                        result = false;
                    } else {
                        this.resultRender(condition);
                    }
                }
            }
        }

        return result;
    }

    inputTextValidator(input) {
        let reg = /^[a-zа-я]+$/i;
        if (!reg.test(input.value)) {
            input.classList.add('invalid');
        }
        return reg.test(input.value);
    }

    inputNumberValidator(input) {
        let reg = /^[0-9]+$/;
        if (!reg.test(input.value)) {
            input.classList.add('invalid');
        }
        return reg.test(input.value);
    }

    removeErrors() {
        for (let i of document.querySelectorAll('.input')) {
            i.classList.remove('invalid');
        }
    }

    resultRender(condition) {
        this.conditions[condition.querySelector('.field').value].push({
            operation: condition.querySelector('.operation').value,
            value: condition.querySelector('.field').value});
    }
}

window.onload = () => {
    const filter = new Filter({
        filterContainerId: 'filter',
        maxNumberOfStrings: 10,
        formClasses: ['col-sm-9'],
        inputContainerClasses: ['d-flex', 'flex-row', 'row-padding'],
        inputClasses: ['form-control', 'row-margin'],
        buttonAddClasses: ['btn', 'btn-link', 'col-margin', 'row-padding'],
        buttonsContainerClasses: ['d-flex', 'flex-row', 'row-padding'],
        buttonApplyClasses: ['btn', 'btn-primary', 'row-margin'],
        buttonClearFilterClasses: ['btn', 'btn-outline-secondary'],
        values: {
            text: ['containing', 'exactly matching', 'begins with', 'ends with'],
            number: ['equal', 'greater than', 'less than']
        },
        defaultField: 'text',
    });

    filter.init();
};

