/*voir donc page.js*/
import {get} from './Async.js';

export default class Router{

    constructor() {
      
        this._elBiero = document.querySelector('[data-js-biero]');

        this._webservice = 'http://127.0.0.1:8000/webservice/php/biere/';

        page.base('/biero-js-vanille'); 

        //route, et appel des méthodes
        page('/', this.#getMeilleuresBieres, this.getTemplate, this.showTemplate); 
        page('/liste', this.#getBieres, this.getTemplate, this.showTemplate);
        page('/biere/:id', this.#getBiere, this.getNote, this.getTemplate, this.showTemplate); //ajout getCommentaire

        page('*', this.getTemplate, this.showTemplate);  // les autres 404 ne pas oublie dans getTemplate de faire une condition...
        page( { window: window } );
        
    }


    #getMeilleuresBieres = (ctx, next) => {
        
    //afficher les 5 premieres bieres...
    get(this._webservice)
    .then((data) => {
        let bieres = data.data;
        console.log(data.data);


        //boucler dans les data pour ajuster la moyenne de chacune des biers
       /* for (let i = 0, l=bieres.length; i<l; i++) {
            bieres[i].note_moyenne = parseFloat(bieres[i].note_moyenne).toFixed(1);
            //gérer l'image par défaut
            if (!bieres[i].image) bieres[i].image = 'assets/images/no-image.jpeg';  
        }*/

    //exemple de donnée fabriqué
       // 
       /*ctx.data = bieres;
       ctx.template = 'liste';
       ctx.data.grid = '4';

        console.log(ctx.template);*/

        //console.log(bieres);
        //next(); //passe à la prochaine méthode...ici getTemplate
    })  
    }


    /*** LISTE BIERE ***** */
    #getBieres = (ctx, next) => {
        
        /*fetch(this._webservice)
            .then((res) => {
                return res.json();
            })*/
            /*remplacer par la méthode */
            get(this._webservice)
            .then((data) => {
                //console.log(data);

                //dans contexte ctx... on peut passer n'importe qu'elle info par la notaton pointé.

                let bieres = data.data;// va chercher le tableau data..juste pour avoir le tableau


                //boucler dans les data pour ajuster la moyenne de chacune des biers
                for (let i = 0, l=bieres.length; i<l; i++) {
                    bieres[i].note_moyenne = parseFloat(bieres[i].note_moyenne).toFixed(1);
                    //gérer l'image par défaut
                    if (!bieres[i].image) bieres[i].image = 'assets/images/no-image.jpeg';  
                }

            //exemple de donnée fabriqué
               // 
               ctx.data = bieres;
               ctx.template = 'liste';
               ctx.data.grid = '4';

                console.log(ctx.template);

                //console.log(bieres);
                next(); //passe à la prochaine méthode...ici getTemplate
            })


    }


    /******   UNE biere */
    #getBiere = (ctx, next) => {
    
        let id = ctx.params.id;
        
       /* fetch(`${this._webservice}/${id}`)
            .then((res) => {
                return res.json();
            })*/
            get(this._webservice)
            .then((data) => {

                //info biere mais pas note no commentaires..
                console.log(data);

                if(data.data) {
                    ctx.data = data.data //viens de l'ouptup tableau data
                    if (!ctx.data.image) ctx.data.image = 'assets/images/no-image.jpeg';
                    ctx.template = 'biere' // nom de la page web
                } else {
                    ctx.data = {}; // reinitialise le data qui le prend dans le template
                    ctx.template = '404'
                }
               
                next(); //passe à la prochaine méthode...ici getTemplate
            })

        }

    
    /*** GET NOTE */
    getNote = (ctx, next) => {

        let id = ctx.params.id;

       /* fetch(`${this._webservice}/${id}/note`)
            .then((res) => {
                return res.json();
            })*/
            get(this._webservice)
            .then((data) => {

                if(data.data) {
                    //ctx.data = data.data //viens de l'ouptup tableau data
                    ctx.template = 'biere' // nom de la page web
                    ctx.data.note = data.data.note
                    ctx.data.note = parseFloat(data.data.note).toFixed(1);
                    ctx.data.nombre = data.data.nombre
                } else {
                    ctx.data = {}; // reinitialise le data qui le prend dans le template
                    ctx.template = '404'
                }

                console.log(ctx.data)
               
                next(); //passe à la prochaine méthode...ici getTemplate
            })
    }

    getTemplate = (ctx, next) => {


        /*check ctx ici */
         // gestion de 404 ....

        //console.log(ctx.template); //output liste

        //charger le fichier template pour aller chercher une vue
       /* fetch(`vues/${ctx.template}.html`)  // avec backtit (`vues/${ctx.template}.html'`)
            .then((res) => {
                return res.text(); //format html
            })*/
            get(`vues/${ctx.template}.html`)
            .then((template) => {

                console.log(ctx.data)


               
                

                
                    ctx.data.template = template ; //assigne le template dans le clé data
                
                
                   
                

                next();
            })
        
    }


    showTemplate = (ctx) => {

       // console.log(ctx);

        let rendered = Mustache.render(ctx.data.template, { data: ctx.data});
        this._elBiero.innerHTML = rendered;
        
    }



}