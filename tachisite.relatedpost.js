//<![CDATA[
function removetag(string, longlength) {
var identtag = string.split("<");
for (var f = 0; f < identtag.length; f++) {
if (identtag[f].indexOf(">") != -1) {
identtag[f] = identtag[f].substring(identtag[f].indexOf(">") + 1, identtag[f].length);
}
}
identtag = identtag.join("");
identtag = identtag.substring(0, longlength - 1);
return identtag;
}	

var maxrelated = 4,
maxsnippet = 150,
allrelatedfeedorigin = new Array,
images_notfound = "https://placehold.it/250x200/777/eee?text=No+Images",
index = 0; // untuk index feed soalnya feednya itu ada 2 atau lebih

function extractfeed(json) {

var feedentry = json.feed.entry,
maxpost = feedentry.length,
monthformat = new Array();

monthformat[01] = "Jan", 
monthformat[02] = "Feb", 
monthformat[03] = "Mar", 
monthformat[04] = "Apr", 
monthformat[05] = "May", 
monthformat[06] = "Jun", 
monthformat[07] = "Jul", 
monthformat[08] = "Aug", 
monthformat[09] = "Sep", 
monthformat[10] = "Oct", 
monthformat[11] = "Nov", 
monthformat[12] = "Dec";

for(i = 0; i < maxpost; i++){

// get title
var title = feedentry[i].title.$t;

// get date
var published = feedentry[i].published.$t,
yearpublished = published.substring(0, 4),
monthpublished = published.substring(5, 7),
daypublished = published.substring(8, 10),
timepublished = published.substring(11, 16),
date = daypublished + "-" + monthformat[parseInt(monthpublished, 10)] + "-" + yearpublished;

// get snippet
var snippetorigin;
if ("summary" in feedentry[i]) {
snippetorigin = feedentry[i].summary.$t;
}else if ("content" in feedentry[i]) {
snippetorigin = feedentry[i].content.$t;
}
var snippet = removetag(snippetorigin,maxsnippet);

// get images
if ("media$thumbnail" in feedentry[i]) {				
var imagesorigin = feedentry[i].media$thumbnail.url;
imagesorigin = imagesorigin.replace('/s72-c/', '/w125-h100-c/');
}else {
var imagesorigin = images_notfound;
}
var images = imagesorigin;

// get link
for(var h=0; h < feedentry[i].link.length; h++){
if (feedentry[i].link[h].rel == "alternate") {
var link = feedentry[i].link[h].href;
break;
}
}	

// get author
var author = feedentry[i].author[0].name.$t;

allrelatedfeedorigin.push({ 
"title" : title,
"link"  : link,
"images"  : images,
"snippet"  : snippet 
});



index++;
}	

}

function shuffle(array) {
var currentIndex = array.length, temporaryValue, randomIndex;

while (0 !== currentIndex) {

randomIndex = Math.floor(Math.random() * currentIndex);
currentIndex -= 1;

temporaryValue = array[currentIndex];
array[currentIndex] = array[randomIndex];
array[randomIndex] = temporaryValue;
}

return array;
}

const removeDupliactes = (values) => {
let concatArray = values.map(eachValue => {
return Object.values(eachValue).join('')
})
let filterValues = values.filter((value, index) => {
return concatArray.indexOf(concatArray[index]) === index

})
return filterValues
}				

function artikelterkait(){

var allrelatedfeed = shuffle(removeDupliactes(allrelatedfeedorigin));
var allrelatedfeedlength = allrelatedfeed.length;

var url_path = location.protocol + '//' + location.host + location.pathname;


html = "<div class='post-related-box'>";
html += "<h4>Postingan lainnya</h4>";
html += "<div class='clear'></div>";
html += "<ul id='related-summary'>";
document.write(html);

for (var xx = 0; xx < allrelatedfeedlength; xx++) {	

if (allrelatedfeed[xx].link !== url_path) {
content = "<li class='news-title clearfix'>";
content += "	<a href='" + allrelatedfeed[xx].link + "' rel='nofollow' target='_top' title='" + allrelatedfeed[xx].title + "'>";
content += "		<div class='overlayb'>";
content += "			<img alt='" + allrelatedfeed[xx].title + "' class='lazy' src='" + allrelatedfeed[xx].images + "' />";
content += "		</div>";
content += "	</a>";
content += "	<div class='overlaytext'>";
content += "		<a class='post-related-title' href='" + allrelatedfeed[xx].link + "' target='_top' title='" + allrelatedfeed[xx].title + "'>" + allrelatedfeed[xx].title + "</a>";
content += "	</div>";
content += "	<span class='news-text'>" + allrelatedfeed[xx].snippet + "</span>";
content += "</li>";
document.write(content);
if (xx >= maxrelated) {
break;
}
}
}

html = "</ul>";
html += "</div>";
document.write(html);

}

//]]>
