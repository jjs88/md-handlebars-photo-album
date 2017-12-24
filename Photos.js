
var Photos = (function() {

    // private vars
    var currentPic, photos, albums;


    // main functions

    function displayData(template, photos) {

        let html = createTemplate(template, photos);

        $(document.body).append(html);
             
    }


    function retrieveData(url) {


        let promise = new Promise(function(resolve, reject) {
            $.ajax(url, {

                success: function(data, status) {
                    resolve(data);
                }
            })
        })

        return promise;
    }



    function generateRandomNums() {

        let numbers = [];

        for(var x=0; x < 20; x++) {
            numbers.push(Math.floor(Math.random() * 500) * 1);
        }

        return numbers;
    }


    function getPhotos(randomNums, pics) {

        let photos = [];

        randomNums.forEach(function(num) {
            photos.push(pics[num]);
        })

        return photos;
    }


    function orderByAlbum(albums, photos) {


        let newPhotos = [];

        for(var x = 0; x < photos.length; x++) { //cycle photos
            for(var y=0; y < albums.length; y++)  { //cycle albums

                if(photos[x].albumId === albums[y].id) {

                    newPhotos.push({
                        album: albums[y].title, 
                        title: photos[x].title,
                        thumbnailUrl: photos[x].thumbnailUrl

                    })

                    break; //if match, go to next photo
                }
            }
        }


        //sort the photos by album
        newPhotos.sort(function(a, b){

            var album1=a.album.toLowerCase(), 
                album2=b.album.toLowerCase()

            if (album1 < album2) //sort string ascending
                return -1 
            if (album1 > album2)
                return 1
            return 0 //default return value (no sorting)
        })


        return newPhotos;      
    }


    function clickThumbnail(e) {

        e.preventDefault();

        if(e.target.classList.contains('photo')) { //only expand if the photo DIV is clicked


            if(currentPic) { //if there is an expanded pic, remove the class and store the current selected pic and add class
                currentPic.classList.remove(removeCorrectExpandPhotoClass());

                currentPic = e.target;
                e.target.classList.add(getCorrectExpandPhotoClass());

            } else { //first time being clicked, store DOM element and add photo class
                currentPic = e.target;
                e.target.classList.add(getCorrectExpandPhotoClass());
            }
        }
    }

    function getCorrectExpandPhotoClass() {

        // console.log(window.innerWidth)
        if( window.innerWidth >= 800 && window.innerWidth < 1117) {
            return 'expandPhoto-mid'
        } else if (screen.width >= 1117) {
            return 'expandPhoto-lg'
        } else {
           
        }
    }


    function removeCorrectExpandPhotoClass() {
        if(currentPic.classList.contains('expandPhoto-mid')) {
            return 'expandPhoto-mid';
        } else if (currentPic.classList.contains('expandPhoto-lg')){
            return 'expandPhoto-lg';
        }
    }




    function photoPartial() {

        let partial = `
            <div class="photo">
                <img src="{{thumbnailUrl}}">
                <h3 class="title"> {{title}}</h3>
                <p>{{album}}</p>
            </div>
        `

        partial = partial.trim();
        
        return partial;
    }


    function createTemplate(input, data) {
        let templateStr = $(input).html(); //create string
        let template = Handlebars.compile(templateStr); //create template

        return template({data:data}); //return html with injected data
    }



    // partials
    Handlebars.registerPartial('photo', photoPartial());




    // CONFIG FUNCTIONS
    function init() {

        
        let promises = [retrieveData('albums.json'), retrieveData('photos.json')]; //retrieve both data sources

        Promise.all(promises).then(function(data) { //first is albums, second is photos

            let nums = generateRandomNums();
            let photos = getPhotos(nums, data[1]);


            let orderedPhotos = orderByAlbum(data[0], photos);

            displayData('#photo-template',orderedPhotos);
            cacheDOM();
            events();
        })    
    }


    function cacheDOM() {

        photos = document.getElementsByClassName('photos')[0];

    }


    function events() {

        photos.addEventListener('click', clickThumbnail);

    }





    // expose module API methods
    return {
        init
    }

})();