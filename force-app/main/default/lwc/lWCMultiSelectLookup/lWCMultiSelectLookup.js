import { LightningElement, track } from 'lwc';



export default class LWCMultiSelectLookup extends LightningElement {
    // @track selectedRecords = [];
    // @track selectedRecordsLength;

    @track type  = [{
            title:'Role',
            apiName:'UserRole',
            iconName:'standard:user_role',
        },
        {
            title:'Profile',
            apiName:'Profile',
            iconName:'standard:individual',
        },
        {
            title:'Public Group',
            apiName:'Group',
            iconName:'standard:groups',
        }
    ]

    handleselectedCompanyRecords(event) {
        // this.selectedRecords = [...event.detail.selRecords]
        // this.selectedRecordsLength = this.selectedRecords.length;
    }
}