'use strict';

class Filter {

    constructor(settings) {
        this.settings = settings;
        this.defaultCondition = null; // default condition html
        this.conditions = 0; // number of conditions
    }

    init() {
        let filterContainer = document.getElementById(`${this.settings.filterContainerId}`);
        filterContainer.innerHTML = this.render();
        this.renderDefaultCondition();
        this.addButtonsEvents();
    }

    // render all except condition
    render() {
        return `<form class="${this.settings.formClasses.join(' ')}">
        <button type="button" class="addCondition ${this.settings.buttonAddClasses.join(' ')}">+ Add condition</button>
        <hr>
        <div class="${this.settings.buttonsContainerClasses.join(' ')}">
            <button type="button" class="applyButton ${this.settings.buttonApplyClasses.join(' ')}">Apply</button>
            <button type="button" class="clearFilterButton ${this.settings.buttonClearFilterClasses.join(' ')}">
                Clear Filter</button>
        </div>
        </form>`;
    }

    renderDefaultCondition() {
        if (!this.defaultCondition) {
            this.defaultCondition = `<div class="${this.settings.inputContainerClasses.join(' ')}">
                                        <select class="field ${this.settings.inputClasses.join(' ')}">`;
            // field select
            for (let i in this.settings.values) {
                let defaultSelected = '';
                if (i === this.settings.defaultField) {
                    defaultSelected = 'selected';
                }
                let content = i.charAt(0).toUpperCase() + i.substr(1); // make first letter capital
                this.defaultCondition += `<option value="${i}" ${defaultSelected}>${content} field</option>`;
            }

            this.defaultCondition += `</select>`;

            //operation select
            this.defaultCondition += `<select class="operation ${this.settings.inputClasses.join(' ')}">`;

            for (let i of this.settings.values[this.settings.defaultField]) { //values.text
                let content = i.charAt(0).toUpperCase() + i.substr(1);
                this.defaultCondition += `<option value="${i}">${content}</option>`;
            }

            this.defaultCondition += `</select>
                <input type="${this.settings.defaultField}" class="${this.settings.inputClasses.join(' ')}">
                <span class="remove-icon hidden"></span>
                </div>`;
        }

        // add condition before +Add button
        document.querySelector('.addCondition').insertAdjacentHTML('beforebegin' ,this.defaultCondition);

        this.conditions++;

        // навесить обработчик на изменение поля, вынести рендер связанного поля в отдельный метод
        document.querySelector('.field').addEventListener('change', () => {
            console.log('select');
        });

        // навесить обработчик на X
        document.querySelector('.remove-icon').addEventListener('click', () => {
            console.log('x');
        });

        // hides +Add button
        if (this.conditions === this.settings.maxNumberOfStrings) {
            document.querySelector('.addCondition').classList.add('hidden');
        }

        // shows X buttons
        if (this.conditions > 1) {
            let removeIcons = document.querySelectorAll('.remove-icon');
            for (let i = 0; i < removeIcons.length; i++) {
                removeIcons[i].classList.remove('hidden')
            }
        }
    }

    addButtonsEvents() {

        // +Add button
        document.querySelector('.addCondition').addEventListener('click', () =>
            this.renderDefaultCondition());

        // Apply button

        //Clear button

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
        defaultField: 'text', // fields can be either text or number
    });

    filter.init();
};

