import { LightningElement, api, track } from 'lwc';
import retriveSearchData from '@salesforce/apex/ReusableMultiSelectLookupCtrl.retriveSearchData';
import { loadStyle } from 'lightning/platformResourceLoader';
import multiselect_css from '@salesforce/resourceUrl/multiselect';

export default class ReusableMultiSelectLookup extends LightningElement {
    @api objectname = 'Account';
    @api fieldnames = ' Id, Name ';
    @api Label;
    @track searchRecords = [];
    @track selectedRecords = [];
    @api iconName = 'standard:account'
    @track messageFlag = false;
    @track isSearchLoading = false;
    @api placeholder = 'Search Role';
    @track searchKey = '';
    delayTimeout;
    @api type = [];

    renderedCallback() {
        Promise.all([loadStyle(this, multiselect_css)]);
    }

    searchField() {
        var selectedRecordIds = [];

        this.selectedRecords.forEach(ele=>{
            selectedRecordIds.push(ele.Id);
        })

        retriveSearchData({ objectName: this.objectname, fieldName: this.fieldnames, value: this.searchKey, selectedRecId: selectedRecordIds })
            .then(result => {
                this.searchRecords = result;
                this.isSearchLoading = false;
                const lookupInputContainer = this.template.querySelector('.lookupInputContainer');
                const clsList = lookupInputContainer.classList;
                clsList.add('slds-is-open');

                if (this.searchKey.length > 0 && result.length == 0) {
                    this.messageFlag = true;
                } else {
                    this.messageFlag = false;
                }
            }).catch(error => {
                console.log(error);
            });
    }

    // update searchKey property on input field change  
    handleKeyChange(event) {
        // Do not update the reactive property as long as this function is
        this.isSearchLoading = true;
        window.clearTimeout(this.delayTimeout);
        const searchKey = event.target.value;
        this.delayTimeout = setTimeout(() => {
            this.searchKey = searchKey;
            this.searchField();
        }, 300);
    }

    // method to toggle lookup result section on UI 
    toggleResult(event) {
        const lookupInputContainer = this.template.querySelector('.lookupInputContainer');
        const clsList = lookupInputContainer.classList;
        const whichEvent = event.target.getAttribute('data-source');

        switch (whichEvent) {
            case 'searchInputField':
                clsList.add('slds-is-open');
                this.searchField();
                break;
            case 'lookupContainer':
                clsList.remove('slds-is-open');
                break;
        }
    }

    setSelectedRecord(event) {
        var recId = event.target.dataset.id;
        var selectName = event.currentTarget.dataset.name;
        let newsObject = this.searchRecords.find(data => data.Id === recId);
        newsObject = JSON.parse(JSON.stringify(newsObject));
        newsObject.iconName = this.iconName;
        this.selectedRecords.push(newsObject);
        this.template.querySelector('.lookupInputContainer').classList.remove('slds-is-open');
        let selRecords = this.selectedRecords;
        this.template.querySelectorAll('lightning-input').forEach(each => {
            each.value = '';
        });

        console.log(this.selectedRecords);
        const selectedEvent = new CustomEvent('selected', { detail: { selRecords }, });
        // Dispatches the event.
        this.dispatchEvent(selectedEvent);
        this.searchKey = '';
    }

    removeRecord(event) {
        let selectRecId = [];
        for (let i = 0; i < this.selectedRecords.length; i++) {
            console.log('event.detail.name--------->' + event.detail.name);
            console.log('this.selectedRecords[i].Id--------->' + this.selectedRecords[i].Id);
            if (event.detail.name !== this.selectedRecords[i].Id)
                selectRecId.push(this.selectedRecords[i]);
        }

        this.selectedRecords = [...selectRecId];
        console.log('this.selectedRecords----------->' + this.selectedRecords);
        let selRecords = this.selectedRecords;
        const selectedEvent = new CustomEvent('selected', { detail: { selRecords }, });
        // Dispatches the event.
        this.dispatchEvent(selectedEvent);
    }

    handleSelectedType(event){
        this.objectname = event.currentTarget.dataset.api;
        this.iconName = event.currentTarget.dataset.name;
        this.placeholder = 'Search '+event.currentTarget.dataset.title;
    }
}