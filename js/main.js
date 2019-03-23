function filterGames(search = null) {
    var searchValue = search ? search.value.toLowerCase() : 'a';
    var breakException = {error:"stop it"};
    var html = '';
    var i = 0;

    try {
        games.map(function (e) {
            if (!e.name.toLowerCase().includes(searchValue)) {
                return;
            }

            html += ' \
                <div class="masonry-brick"> \
                    <a href="images/covers/' + e.name + '.bmp" download> \
                        <img src="images/fullsize/' + e.name + '.png"> \
                        <span>' + e.name + '</span> \
                    </a> \
                </div>';
            i++;

            if (i >= 12) throw breakException;
        });
    } catch (e) {
        if (e !== breakException) throw e;
    }

    if (html === '') {
        html = 'Sorry, your search has no results.'
    }

    document.getElementById("gameList").innerHTML = html;
}
