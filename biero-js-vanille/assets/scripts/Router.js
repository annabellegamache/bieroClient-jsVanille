/*voir donc page.js*/
import {get} from './Async.js';

export default class Router{

    constructor() {
      
        this._elBiero = document.querySelector('[data-js-biero]');

        this._webservice = 'http://127.0.0.1:8000/webservice/php/biere/';

        page.base('/biero-js-vanille'); 

        //route, et appel des méthodes
        page('/', this.#getMeilleuresBieres, this.getTemplate, this.showTemplate); //# = private
        page('/liste', this.#getBieres, this.getTemplate, this.showTemplate);
        page('/liste/:cle', this.#getBieres, this.getTemplate, this.showTemplate);
        page('/biere/:id', this.#getBiere, this.getNote, this.getCommentaire, this.getTemplate, this.showTemplate); //ajout getCommentaire

        page('*', this.getTemplate(), this.showTemplate);  // les autres 404 
        
        page( { window: window } );
        
    }

/********************ROUTE / ************************************/
    #getMeilleuresBieres = (ctx, next) => {
            //get(this._webservice)
            fetch(this._webservice)
            .then((res) => {

                return res.json();

            })
            .then((data) => {

                let bieres = data;
                bieres = bieres.data;

                bieres = this.#sortBieres(bieres, 'note_moyenne', 'DESC'); 

                //garder les 5 meilleurs
                bieres = bieres.slice(0, 5);
            
                //Ajustement de la moyenne de chacune des bieres
                for (let i = 0, l=bieres.length; i<l; i++) {
                    bieres[i].note_moyenne = parseFloat(bieres[i].note_moyenne).toFixed(1);
                    //Gestion l'image par défaut
                    if (!bieres[i].image) bieres[i].image = 'assets/images/no-image.jpeg';
                }


               //set wanted data
               ctx.data = bieres;
               ctx.data.note = bieres.note;
               //ctx.data.filtre = false ;
               ctx.template = 'liste';
               ctx.data.grid = 'hero';

                next();
            })


    }

   


   /********************ROUTE /LISTE ************************************/
    #getBieres = (ctx, next) => {
        
            //get(this._webservice)
            fetch(this._webservice)
            .then((res) => {

                return res.json();

            })
            .then((data) => {

                let bieres = data;
                bieres = bieres.data;

                /*gestion filtre*/
                if(ctx.params.cle) {

                    ctx.params.cle = ctx.params.cle.split('|')  
                    let ordre =  ctx.params.cle[1];
                    ctx.params.cle = ctx.params.cle[0]
                    bieres = this.#sortBieres(bieres, ctx.params.cle, ordre); //appel split

                }

                //Ajustement de la moyenne de chacune des bieres
                for (let i = 0, l=bieres.length; i<l; i++) {

                    bieres[i].note_moyenne = parseFloat(bieres[i].note_moyenne).toFixed(1);
                    //Gestion l'image par défaut
                    if (!bieres[i].image) bieres[i].image = 'assets/images/no-image.jpeg'; 

                }

               //set wanted data
               ctx.data = bieres;
               ctx.data.filtre = true ;
               ctx.template = 'liste';
               ctx.data.grid = '4';

               next();

            })


    }



    /********************SORT ************************************/
    #sortBieres = (data, cle, ordre = 'ASC') => {

        data.sort((a,b) => {
            if( a[cle] < b[cle] ) return -1
            if( a[cle] > b[cle] ) return 1
            return 0
        });

       if(ordre == 'DESC') data = data.reverse();
       
       return data;
        
    }



    /********************ROUTE /BIERE/:ID ************************************/
    #getBiere = (ctx, next) => {
        let id = ctx.params.id;
        //get(`${this._webservice}/${id}`)
        fetch(`${this._webservice}/${id}`)
            .then((res) => {
                return res.json();
            })
        .then((data) => {
            //console.log(data.data)
            if(data.data) {
                ctx.data = data.data;
                if (!ctx.data.image) ctx.data.image = 'assets/images/no-image.jpeg';
                ctx.template = 'biere' 
            } else {
                /* 404 */
                ctx.data = {}; 
                ctx.template = '404'
            }
           next();
        })
    }

    
    /*** GET UNE BIERE NOTE */
    getNote = (ctx, next) => {
        let id = ctx.params.id;
        //get(`${this._webservice}/${id}/note`)
        fetch(`${this._webservice}/${id}/note`)
            .then((res) => {
                return res.json();
            })
        .then((data) => {
            if(data.data) {
                ctx.template = 'biere' 
                ctx.data.note = data.data.note
                ctx.data.note = parseFloat(data.data.note).toFixed(1);
                ctx.data.nombre = data.data.nombre
            } else {
                /* 404 */
                ctx.data = {}; 
                ctx.template = '404'
            }

        //console.log(ctx.data) 
        next(); 

        });
    }



     /*** GET UNE BIERE COMMENTAIRE */
     getCommentaire = (ctx, next) => {
        let id = ctx.params.id;
        //get(`${this._webservice}/${id}/note`)
        fetch(`${this._webservice}/${id}/commentaire`)
            .then((res) => {
                return res.json();
            })
        .then((data) => {
            console.log(data)
            if(data.data) {
                ctx.template = 'biere'
                console.log(data.data)
                ctx.data.commentaire = data.data
                //console.log(ctx.data)
            } else {
                /* 404 */
                ctx.data = {}; 
                ctx.template = '404'
            }

      //  console.log(ctx.data) 
        next(); 

        });
    }




   /********************GESTION TEMPLATE ************************************/

   /* GET TEMPLATE*/
    getTemplate = (ctx, next) => {

       //ne fonctionne pas et je n'ai pas trouvé comment faire...
      /* if(!ctx){
        ctx.template='404';
       }*/
    
        
        //get(`vues/${ctx.template}.html`)
        fetch(`vues/${ctx.template}.html`)   
            .then((res) => {
                 return res.text();  
            })
            .then((template) => {
                ctx.data.template = template ; //assigne le template dans le clé data
                next();
            }).catch(function(){
                console.log('pas ok') //va pas la...
            })
        
    }

    /*SHOW TEMPLATE*/
    showTemplate = (ctx) => {

       //console.log(ctx);
        
    
        let rendered = Mustache.render(ctx.data.template, {data:ctx.data});
        //console.log({data:ctx.data});
        this._elBiero.innerHTML = rendered;

        //pour mettre l'option selected
        if(ctx.params.cle){
            let selectedOption = document.querySelector(`option[value="${ctx.params.cle}"]`);
            selectedOption.selected = 'selected'
        }
        
    }



}