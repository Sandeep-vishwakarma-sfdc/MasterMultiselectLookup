public with sharing class ReusableMultiSelectLookupCtrl {
    @AuraEnabled(cacheable=true)
    public static List<sObject> retriveSearchData(String objectName, String fieldName, String value, List<String> selectedRecId) {
        List<sObject> sObjectResultList = new List<sObject>();
        if(selectedRecId == null){
            selectedRecId = new List<String>();
        }
        if(String.isNotEmpty(value)) {
            String query = 'Select '+fieldName+' FROM '+objectName+' WHERE Name LIKE \'%' + value.trim() + '%\' and ID NOT IN: selectedRecId order by LastModifiedDate DESC LIMIT 5';
            for(sObject so : Database.Query(query)) {
                sObjectResultList.add(so);
            }
        }else{
            String query = 'Select '+fieldName+' FROM '+objectName+' WHERE ID NOT IN: selectedRecId order by LastModifiedDate DESC LIMIT 5';
            for(sObject so : Database.Query(query)) {
                sObjectResultList.add(so);
            }
        }
        return sObjectResultList;
    }
}