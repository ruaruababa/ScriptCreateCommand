
async function fetchText() {
    let response = await fetch(baseURL24);
    let data = await response.json();
    //process  data
    const lecture = data?.lecture;
    const convertToArray = Object.keys(lecture).map((item) => {
        return {
            ...lecture[item],
        };
    });
    const courseData = [];
    convertToArray.map((item, index) => {
        for (let i = 0; i < Object.keys(item).length; i++) {
            courseData.push({
                ...item[i],
            });
        }
    });

    //Function to create and download file
    function download(text, name, type) {
        var a = document.getElementById('a');
        var file = new Blob([text], {type: type});
        a.href = URL.createObjectURL(file);
        a.download = name;
    }

    //Content of the file
    const urlList = [];
    courseData.map((item, index) => {
        urlList.push(
            `ffmpeg -i ${item.url} -bsf:a aac_adtstoasc -vcodec copy -c copy -crf 50 Unit${item.lectureGroup}lesson${item.index}.mp4`,
        );
    });
    var listCommand = urlList.join('\n').toString();
    //Create .bat file
    download(listCommand, 'multiDownloadScript24day.bat', 'text/plain');

    //Download multiple files not necessary
    function download_files(files) {
        function download_next(i) {
            if (i >= files.length) {
                return;
            }
            var a = document.createElement('a');
            a.href = files[i].download;
            a.target = '_parent';
            // Use a.download if available, it prevents plugins from opening.
            if ('download' in a) {
                a.download = files[i].filename;
            }
            // Add a to the doc for click to work.
            (document.body || document.documentElement).appendChild(a);
            if (a.click) {
                a.click(); // The click method is supported by most browsers.
            } else {
                $(a).click(); // Backup using jquery
            }
            // Delete the temporary link.
            a.parentNode.removeChild(a);
            // Download the next file with a small timeout. The timeout is necessary
            // for IE, which will otherwise only download the first file.
            setTimeout(function () {
                download_next(i + 1);
            }, 500);
        }
        // Initiate the first download.
        download_next(0);
    }
    // function download(text, name, type) {
    //     var a = document.getElementById('a');
    //     var file = new Blob([text], {type: type});
    //     a.href = URL.createObjectURL(file);
    //     a.download = name;
    // }
    // function do_dl() {
    //     download_files(urlList);
    // }
    // do_dl();
}
fetchText();
