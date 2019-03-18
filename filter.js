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
        <div id="conditionsContainer"></div>
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

            this.defaultCondition += `</select>
                                      <select class="operation ${this.settings.inputClasses.join(' ')}">`;

            this.defaultCondition += this.renderSelectOperation(this.settings.defaultField);// .operation options
            this.defaultCondition += `<span class="remove-icon hidden"></span></div>`;
        }

        // add condition in #conditionsContainer
        document.getElementById('conditionsContainer').insertAdjacentHTML('beforeend' ,this.defaultCondition);

        this.conditions++;

        let lastChild = document.getElementById('conditionsContainer').lastChild;
        lastChild.querySelector('.field').addEventListener('change', (e) =>
            lastChild.querySelector('.operation').innerHTML = this.renderSelectOperation(e.target.value));

        lastChild.querySelector('.remove-icon').addEventListener('click', () => {
            document.getElementById('conditionsContainer').removeChild(lastChild);
            this.conditions--;
            if (this.conditions === 1) {
                document.querySelector('.remove-icon').classList.add('hidden');
            }
            if (this.conditions === this.settings.maxNumberOfStrings - 1) {
                document.querySelector('.addCondition').classList.remove('hidden');
            }
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

    //operation select and input
    renderSelectOperation(field) {
        let result = '';

        for (let i of this.settings.values[field]) { //values.text or values.number
            let content = i.charAt(0).toUpperCase() + i.substr(1);
            result += `<option value="${i}">${content}</option>`;
        }

        result += `</select>
                    <input type="${field}" class="${this.settings.inputClasses.join(' ')}">`;
        return result;
    }

    addButtonsEvents() {

        // +Add button
        document.querySelector('.addCondition').addEventListener('click', () =>
            this.renderDefaultCondition());

        // Apply button
        document.querySelector('.applyButton').addEventListener('click', () => {

        });

        //Clear button
        document.querySelector('.clearFilterButton').addEventListener('click', () => {
            document.getElementById('conditionsContainer').innerHTML = '';
            this.renderDefaultCondition();
            document.querySelector('.remove-icon').classList.add('hidden');
            document.querySelector('.addCondition').classList.remove('hidden');
        });

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

