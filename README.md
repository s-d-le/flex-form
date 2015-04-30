Human form

Update 28/4/2015
Status:
- I have finally have the entire questions printed out with input text and select box in HTML format
- The key-to-HTML logic is hardcoded (they are stored in the replacedKey array). However in the next version, this array will be replaced by the data from the previous RegEx filter
- Questions with two option keys does not work properly yet
- The code has been cleaned up, commented and reindent

-----------------------------------------------------------------------
Update 21/4/2015

Status:
- Question that requires no input or select field needs [none] to make it easier for the JS filter
- I have added a new section of JS to filter out duplicated options calls. Eg: There are 4 calls to the animals.json from the questions. These duplicates are now reduced to only one animals.json call
- I now can access the set of data in the options tables (animals, sizes) adn loop these options as HTML in the view by using ng-repeat
- The project is now on Inner Source


Todo:
- The missed jsons calls have not been dealt with.
- Build the HTML around the options sets in Angular
- Push these options sets into the final escapedHTML object

-----------------------------------------------------------------------
Update 14/4/2015
Fixes:
- Changes 'parent' to 'child' since it is easier to find the next question in the sequence by going down the database instead of going up
- Changes 'animal' to 'option' in the 'animals' table. It sounds more generic and easier for AJS to extract.
- RegEx now can extract words between the [] and without the brackets

Status:
- I have finally decided the logic behind the JS should be kept simple. Lets say we are dealing with: I live with [animals] | type:option. We use JS RegEx to get:

a = 'I live with'; //pure text
b = 'animals'; //whatever between brackets will be used for the next http.get

And we pre write the HTML element of type:option
c = '<select>**TO DO**</selection>'

Then we make a new http.get(b + '.json') to get the options (b is going to animals)
Next we throw those option into the pre written HTML
c = '<select>
		option:dog
		option:cat
		option:panda
	</selection>'

Finally we concat a and c into an array. And use ng-repeat to display it on view. We will have something like this:
<div>

	I live with '<select>
			option:dog
			option:cat
		</selection>'

</div>

- I have managed to do all the filter, regex and I have the data separated into its smallest unit now. This way I'm confident to tell that the application is fully configurable.

- My most difficult task now is how to construct the <select> with <options> retrieved from a database. Perhaps I can <option ng-repeat="o in options"> ?

Todo:
- 15/4 Construct the <select> elements
- 16/4 Display the questions in correct sequence
- 17/4 Finalizing and styling


-----------------------------------------------------------------------
Update 12/4/2015
Objectives:
- Create a new kind of form element with the "sentence to sentence" approach. Resemble the form from https://www.hioscar.com/get-oscar/quote/
- User friendly, human-like conversation impression
- Configurable. Personnel in customer service need to be able to understand how to setup the database to work with the asset.

Data samples:
{
	"questions" : 
	[
		{"id" : 1, "parent" : 0, "step" : 1, "question" : "My name is [user:name]", "inputType" : "text"},
		{"id" : 2, "parent" : 0, "step" : 1, "question" : "I live by myself", "inputType" : "none"},
		{"id" : 3, "parent" : 0, "step" : 1, "question" : "I live with [animal]", "inputType" : "option"},
		{"id" : 4, "parent" : 2, "step" : 2, "question" : "I would like to adopt [animal]", "inputType" : "option"},
	],

	"animals" : 
	[
		{"id" : 1, "animal" : "cat"},
		{"id" : 2, "animal" : "dog"},
		{"id" : 3, "animal" : "panda"}
	]
}

- 'Parent' refers to the id of the parent question
- 'Step' restricts the question to the according sentence
- [user:name], [animal]... indicate where the input or option field will be placed in the sentence and what kind of data will the placed in. Ex: [animal] will indicates Angular to make a http.get to 'animal' table and fill the options with data in the table.
- 'inputType' indicates what type of HTML input the question will have. This will help Angular constructs and escape the appropriate HTML tags

Logic:
- Get data from the set of questions.
- Using JS match() and replace() with RegEx I will filter out the contents between square brackets.
- Use Angular $sce to construct the HTML elements according to the 'inputType'
- Display question from step 1
- Step two questions will be displayed by using 'parent' field to find which option has been selected.
- If the question contains options, the text between brackets will indicate which table contains the options