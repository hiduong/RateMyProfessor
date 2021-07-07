
function RateProfessor () {

    // PRIVATE VARIABLES
        
    // The backend we'll use for Part 2. For Part 3, you'll replace this 
    // with your backend.
    //var apiUrl = 'http://localhost:5000';
    //var apiUrl = 'https://rateprofessor.herokuapp.com';
    var apiUrl = 'https://duong-warmup.herokuapp.com';

    var professorlist; // professors container, value set in the "start" method below
    var profTemplateHtml; // a template for creating reviews. Read from index.html
    // in the "start" method

    var reviews; // reviews container, value set in the "start" method below
    var reviewTemplateHtml; // a template for creating reviews. Read from index.html
    // in the "start" method
    
    var create_review; // create_review form, value set in the "start" method below
    var add_professor; // add_professor form, value set in the "start" method below

    var profId;

    // PRIVATE METHODS
      
   /**
    * HTTP GET request 
    * @param  {string}   url       URL path, e.g. "/api/allprofs"
    * @param  {function} onSuccess   callback method to execute upon request success (200 status)
    * @param  {function} onFailure   callback method to execute upon request failure (non-200 status)
    * @return {None}
    */
   var makeGetRequest = function(url, onSuccess, onFailure) {
       $.ajax({
           type: 'GET',
           url: apiUrl + url,
           dataType: "json",
           success: onSuccess,
           error: onFailure
       });
   };

    /**
     * HTTP POST request
     * @param  {string}   url       URL path, e.g. "/api/allprofs"
     * @param  {Object}   data      JSON data to send in request body
     * @param  {function} onSuccess   callback method to execute upon request success (200 status)
     * @param  {function} onFailure   callback method to execute upon request failure (non-200 status)
     * @return {None}
     */
    var makePostRequest = function(url, data, onSuccess, onFailure) {
        $.ajax({
            type: 'POST',
            url: apiUrl + url,
            data: JSON.stringify(data),
            contentType: "application/json",
            dataType: "json",
            success: onSuccess,
            error: onFailure
        });
    };
    
    /**
     * Insert professor into professorlist container in UI
     * @param  {Object}  professor       professor JSON
     * @param  {boolean} beginning   if true, insert professor at the beginning of the list of professorlist
     * @return {None}
     */
    var insertProfessor = function(professor, beginning) {
        // Start with the template, make a new DOM element using jQuery
        var newElem = $(profTemplateHtml);
        // Populate the data in the new element
        // Set the "id" attribute 
        newElem.attr('id', professor.id); 
        // Now fill in the data that we retrieved from the server
        newElem.find('.name').text(professor.name+" "+professor.lastname);
        // FINISH ME (Task 2): fill-in the rest of the data 
        newElem.find('.affiliate').text(professor.affiliate);
        newElem.find('.school').text(professor.school);
        if(professor.overall_rating > 4.0){
        	newElem.find('.rating_none').removeClass('rating_none').addClass('rating_5');
        }
        else if(professor.overall_rating <= 4.0 && professor.overall_rating > 3.0){
        	newElem.find('.rating_none').removeClass('rating_none').addClass('rating_4');
        }
        else if(professor.overall_rating <= 3.0 && professor.overall_rating > 2.0){
        	newElem.find('.rating_none').removeClass('rating_none').addClass('rating_3');
        }
        else if(professor.overall_rating <= 2.0 && professor.overall_rating > 1.0){
        	newElem.find('.rating_none').removeClass('rating_none').addClass('rating_2');
        }
        else if(professor.overall_rating <= 1.0 && professor.overall_rating > 0){
        	newElem.find('.rating_none').removeClass('rating_none').addClass('rating_1');
        }
       

        if (beginning) {
            professorlist.append(newElem);
        } else {
            professorlist.preend(newElem);
        }
    };


     /**
     * Get all professors from API and display in alphabetical order by lastname
     * @return {None}
     */
    var displayProfessors = function() {
        // Prepare the AJAX handlers for success and failure
        var onSuccess = function(data) {
            /* FINISH ME (Task 2): display all professors from API and display in alphabetical orded by lastname */
            var jsondata = data.professors;
            for(var i = 0; i < jsondata.length; i++){
            	insertProfessor(jsondata[i],true);
            }
            console.log('Display Professors - Success')
        };
        var onFailure = function() { 
            console.error('List all professors - Failed'); 
        };
        /* FINISH ME (Task 2): make a GET request to get recent professors */
        let requestUrl = '/api/allprofs?order_by=lastname'
        console.log(requestUrl);
        makeGetRequest(requestUrl,onSuccess,onFailure);

    };


    
    /**
     * Insert reviews into reviews container in UI
     * @param  {Object}  review       review JSON 
     * @param  {boolean} beginning   if true, insert review at the beginning of the list of reviews
     * @return {None}
     */
    var insertReview = function(reviewx, beginning) {
        // Start with the template, make a new DOM element using jQuery
        var newElem = $(reviewTemplateHtml);
        // Populate the data in the new element
        // Set the "id" attribute 
        newElem.attr('id', reviewx.id); 
        // Now fill in the data that we retrieved from the server
        // FINISH ME (Task 3): fill-in the rest of the data
       	newElem.find('.review_text').text(reviewx.review_text);


       	var d = new Date(reviewx.created_at);

       	var arr = d.toString().split(' ');

       	var arr2 = arr[4].split(':');

       	newElem.find('.created_at').text('Posted at ' + arr2[0] + ':' + arr2[1] + ' ' + arr[1] + ' ' + arr[2] + ', ' + arr[3]);

        if(reviewx.rating > 4.0){
        	newElem.find('.rating_none').removeClass('rating_none').addClass('rating_5');
        }
        else if(reviewx.rating <= 4.0 && reviewx.rating > 3.0){
        	newElem.find('.rating_none').removeClass('rating_none').addClass('rating_4');
        }
        else if(reviewx.rating <= 3.0 && reviewx.rating > 2.0){
        	newElem.find('.rating_none').removeClass('rating_none').addClass('rating_3');
        }
        else if(reviewx.rating <= 2.0 && reviewx.rating > 1.0){
        	newElem.find('.rating_none').removeClass('rating_none').addClass('rating_2');
        }
        else if(reviewx.rating <= 1.0 && reviewx.rating > 0){
        	newElem.find('.rating_none').removeClass('rating_none').addClass('rating_1');
        }



        if (beginning) {
            reviews.append(newElem);
        } else {
            reviews.preend(newElem);
        }
    };



     /**
     * Get recent reviews from API and display most recent 50 reviews
     * @return {None}
     */
    var displayReviews = function() {
        // Delete everything from .reviews
        reviews.html('');
        // Prepare the AJAX handlers for success and failure
        var onSuccess = function(data) {
            // FINISH ME (Task 3): display reviews with most recent reviews at the beginning 
            var jsondata = data.reviews;
            for(var i = 0; i < jsondata.length; i++){
            	insertReview(jsondata[i],true);
            }
            console.log("display review - ok");
        };
        var onFailure = function() { 
            // FINISH ME (Task 3): display an alert box to notify that the reviews couldn't be retrieved ; print the errror message in the console. 
            console.error('Display Review - Failed');
        };
        // FINISH ME (Task 3): get the id of the selected professor from the header 
        console.log(profId);

        // FINISH ME (Task 3): make a GET request to get reviews for the selected professor 
        let requestUrl = '/api/getreviews?profID='+profId+'&order_by=created_at&count=20'
        console.log(requestUrl);
        makeGetRequest(requestUrl,onSuccess,onFailure);

    };

        /**
     * Add event handlers for clicking select.
     * @return {None}
     */
    var attachSelectHandler = function(e) {
        // Attach this handler to the 'click' action for elements with class 'select_prof'
        professorlist.on('click', '.btn', function(e) {
            // FINISH ME (Task 4): get the id, name, title, school of the selected professor (whose select button is clicked)      
            profId = $(this).parents('article').attr('id');  //FINISH ME
            console.log(profId);
            var name = $(this).parents('article').find('.name').text();   //FINISH ME
            console.log(name);
            var title = $(this).parents('article').find('.affiliate').text();   //FINISH ME
            console.log(title);
            var school = $(this).parents('article').find('.school').text(); //FINISH ME
            console.log(school);
            
            // FINISH ME (Task 4):  update the selected_prof content in the header with these values. 
           	$('.selected_prof').find('.selected_name').html(name);	
           	$('.selected_prof').find('.selected_title').html(title);
           	$('.selected_prof').find('.selected_school').html(school);		

            // FINISH ME (Task 4): display the reviews for the selected professor
            displayReviews();

            //activate and show the reviews tab
            $('.nav a[href="#showreview"]').tab('show');
        });
    };

    /**
     * Update the professors rating image based on the current rating.
     * @param  {Object}  prof       professor JSON ; includes updated professor data received from the backend
     * @return {None}
     */
    var updateProfessor = function (prof){
        var newElem = $(profTemplateHtml);
 
        // FINISH ME (Task 5):  get the "class" attribute value for the professor rating div (professors id is "prof.id")
        // remember that the rating class value can one of the following: rating_none or rating_1 or rating_2 or rating_3 or rating_4 or rating_5 
        // Hint: get the professor_box element with id 'prof.id'. Get the class attribute for the div inside '.overall_rating'.
     	console.log(prof.id);
        console.log(prof.overall_rating);

        // FINISH ME (Task 5):  remove the current "class" attribute value for the professor ratin
        var x = prof.id.toString();
        // FINISH ME (Task 5):  add  the new "class" attribute value for the professor rating 
        if(prof.overall_rating > 4.0){
           professorlist.find("#"+x+" .rating_4").removeClass('rating_4').addClass('rating_5');
           professorlist.find("#"+x+" .rating_3").removeClass('rating_3').addClass('rating_5');
           professorlist.find("#"+x+" .rating_2").removeClass('rating_2').addClass('rating_5');
           professorlist.find("#"+x+" .rating_1").removeClass('rating_1').addClass('rating_5');
           professorlist.find("#"+x+" .rating_none").removeClass('rating_none').addClass('rating_5');      
        }
        else if(prof.overall_rating <= 4.0 && prof.overall_rating > 3.0){
            professorlist.find("#"+x+" .rating_5").removeClass('rating_5').addClass('rating_4');
           professorlist.find("#"+x+" .rating_3").removeClass('rating_3').addClass('rating_4');
           professorlist.find("#"+x+" .rating_2").removeClass('rating_2').addClass('rating_4');
           professorlist.find("#"+x+" .rating_1").removeClass('rating_1').addClass('rating_4');
           professorlist.find("#"+x+" .rating_none").removeClass('rating_none').addClass('rating_4');
        }
        else if(prof.overall_rating <= 3.0 && prof.overall_rating > 2.0){
            professorlist.find("#"+x+" .rating_5").removeClass('rating_5').addClass('rating_3');
           professorlist.find("#"+x+" .rating_4").removeClass('rating_4').addClass('rating_3');
           professorlist.find("#"+x+" .rating_2").removeClass('rating_2').addClass('rating_3');
           professorlist.find("#"+x+" .rating_1").removeClass('rating_1').addClass('rating_3');
           professorlist.find("#"+x+" .rating_none").removeClass('rating_none').addClass('rating_3');
        }
        else if(prof.overall_rating <= 2.0 && prof.overall_rating > 1.0){
            professorlist.find("#"+x+" .rating_5").removeClass('rating_5').addClass('rating_2');
           professorlist.find("#"+x+" .rating_4").removeClass('rating_4').addClass('rating_2');
           professorlist.find("#"+x+" .rating_3").removeClass('rating_3').addClass('rating_2');
           professorlist.find("#"+x+" .rating_1").removeClass('rating_1').addClass('rating_2');
           professorlist.find("#"+x+" .rating_none").removeClass('rating_none').addClass('rating_2');
        }
        else if(prof.overall_rating <= 1.0 && prof.overall_rating > 0){
            professorlist.find("#"+x+" .rating_5").removeClass('rating_5').addClass('rating_1');
           professorlist.find("#"+x+" .rating_4").removeClass('rating_4').addClass('rating_1');
           professorlist.find("#"+x+" .rating_3").removeClass('rating_3').addClass('rating_1');
           professorlist.find("#"+x+" .rating_2").removeClass('rating_2').addClass('rating_1');
           professorlist.find("#"+x+" .rating_none").removeClass('rating_none').addClass('rating_1');
        }
        

        

    }

    /**
     * Add event handlers for submitting the create review form.
     * @return {None}
     */
    var attachReviewHandler = function(e) {   
        // add a handler for the 'Cancel' button to cancel the review and go back to "FIND YOUR PROFESSOR" (#list) tab
        create_review.on('click', '.cancel_review', function (e) {
            //activate and show the reviews tab
            $('.nav a[href="#showreview"]').tab('show');
        });
        
        // FINISH ME (Task 5): add a handler to the 'Post Review' (.submit_review_input) button to
        //                     post the review for the chosen professor
        // The handler for the Post button in the form
        create_review.on('click', '.submit_review_input', function (e) {
            e.preventDefault(); // Tell the browser to skip its default click action

            var review = {}; // Prepare the review object to send to the server
            review.prof_id =  profId;
            review.review_text = create_review.find('.review_input').val();
            review.rating = create_review.find('.review_rating_input').val();
            
            // FINISH ME (Task 5): collect the rest of the data for the review
            
            var onSuccess = function(data) {
                // FINISH ME (Task 5): update the professor's review rating based on the data received from backend
                // Hint: call updateProfessor
                
                // FINISH ME (Task 5): insert review at the beginning of the reviews container
   				insertReview(data.review,true);
   		        // Hint : call InsertReview
               	updateProfessor(data.professor);
                //activate and show the reviews tab
                $('.nav a[href="#showreview"]').tab('show');
            };
            var onFailure = function() { 
                //FINISH ME (Task 5): display an alert box to notify that the review could not be created ; print the errror message in the console.
                console.error("Failed to create review"); 
            };
            
            // FINISH ME (Task 5): make a POST request to add the review
       
   
            makePostRequest('/api/addreview',review,onSuccess,onFailure);

        });
    };

    /**
     * Add event handlers for submitting the create review form.
     * @return {None}
     */
    var attachProfessorHandler = function(e) {   
        // FINISH ME (Task 6): add a handler for the 'Cancel' button to cancel the review and go back to "FIND YOUR PROFESSOR" (#list) tab
        add_professor.on('click', '.cancel_prof', function (e) {
            //activate and show the #list tab
            $('.nav a[href="#list"]').tab('show');
        });
        
        // add a handler to the 'Add Professor' (.submit_prof_input) button to
        // create a new professor

        // The handler for the Post button in the form
        add_professor.on('click', '.submit_prof_input', function (e) {
            e.preventDefault (); // Tell the browser to skip its default click action

            var prof = {};
            // Prepare the review object to send to the server
            // FINISH ME (Task 6): collect the rest of the data for the professor
            
            prof.name = add_professor.find('.name_input').val();
            prof.lastname = add_professor.find('.lastname_input').val();
           	prof.affiliate = add_professor.find('.title_input').val();
           	prof.school = add_professor.find('.school_input').val();
           	console.log(prof.name);
           	console.log(prof.lastname);
           	console.log(prof.affiliate);
           	console.log(prof.school);
            var onSuccess = function(data) {
                // FINISH ME (Task 6): insert professor at the beginning of the professorlist container
                // Hint : call insertProfessor

                insertProfessor(prof,true);
                
                console.log("insert professor - ok");

                location.reload();

                // FINISH ME (Task 6): activate and show the #list tab
            };
            var onFailure = function() { 
                //FINISH ME (Task 6): display an alert box to notify that the professor could not be created ; print the errror message in the console. 
                console.error("Failed to submit professor");
            };
            
            // FINISH ME (Task 6): make a POST request to add the professor
            makePostRequest('/api/newprofessor',prof,onSuccess,onFailure);
            
            
        });

    };
    
    /**
     * Start the app by displaying the list of the professors and attaching event handlers.
     * @return {None}
     */
    var start = function() {
        //get the professor HTML template
        professorlist = $(".professorlist");
        // Grab the first professor div element, to use as a template
        profTemplateHtml = $(".professorlist .professor_box")[0].outerHTML;
        // Delete everything from .professorlist
        professorlist.html('');
        displayProfessors();

        reviews = $(".reviews");
        // Grab the first review, to use as a template
        reviewTemplateHtml = $(".reviews .review")[0].outerHTML;
        // Delete everything from .reviews
        reviews.html('');
        
        //get the reference to the <form> element with id "addReviewForm" and store it in create_review valiable. We will use this variable to access "addReviewForm" element in DOM. 
        create_review = $("form#addReviewForm");
        attachSelectHandler();
        attachReviewHandler();

        add_professor = $("form#addProfForm");
        attachProfessorHandler();
    };
    

    // PUBLIC METHODS
    // any private methods returned in the hash are accessible via RateProfessor.key_name, e.g. RateProfessor.start()
    return {
        start: start
    };
    
};
