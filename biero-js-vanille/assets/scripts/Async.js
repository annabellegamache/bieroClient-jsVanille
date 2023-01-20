
class Async {
    get = async (ressource) => {
        try {
            let response =  await fetch(ressource);
            console.log(response.ok);
            if(response.ok){
                const contentType = response.headers.get('Content-Type');
                console.log('contentType');
                //test si format json dans le string de retour
                if(contentType && contentType.indexOf('application/json') != -1) return response.json()
                else return response.text()
            }
            else throw new Error("La réponse n'est pas ok")
        }
        catch (error) {
            return error.message;
        }
    }
}


export const {get} = new Async();