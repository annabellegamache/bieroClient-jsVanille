export default class SortBiere {

    constructor(){
        this._elBiero = document.querySelector('[data-js-biero]');
        //console.log(this._elBiero)
        this.init(); 
    }

    /*initialisation comme ca puisque le parents existe toujours
     * autre stratégie... sur route liste...lance instance de SortBiere
    */
    init(){
        this._elBiero.addEventListener('change', (e) => {
            //console.log(e.target)
            if(e.target.hasAttributes('data-js-filtre') && e.target.value != 0){
                //console.log('change')
                page.redirect(`/liste/${e.target.value}`)

            }
        })
    }

}