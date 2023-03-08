const desiredHash = "#!UDMxMDI5OCRAXnN1Z2FuZy8kQF4kQF5NMDA4OTU4JEBe7Z2s66ed7IiY7JeFJEBeTTAwODk1OCRAXjFkOThmNjkxN2Y2YzAzMTg1YTcwYWQ4NzBkYzBiOGYxY2FhNzJkN2MyOWY1ZDVmZjNmZTMxNjY4NTg5MjU3NTY=";

let courseOrders = [];

const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms))
};

const saveOrder = () => {
    let sortableList = $('#sortable_table > tr');
    courseOrders = [];
    sortableList.each(function(idx, course) {
        courseOrders.push(course.children[8].innerText)
    });
    if(navigator.userAgent.indexOf("Firefox") == -1) {
        chrome.storage.local.set({'saved': courseOrders});
    }
    else {
        browser.storage.local.set({'saved': courseOrders});
    }

};

const observer = new MutationObserver((mutations, ob) => {
    for(const mutation of mutations) {
        if (mutation.type === 'childList') {
            $('#sortable_table').remove();
            sortDesiredCourse();
            break;
        }
    }
});

const sortDesiredCourse = () => {
    if($('#sortable_table').length != 0) {
        return;
    }

    let originCourses  = $('#gdMain > tbody > tr'); 
    if(originCourses.length == 0 || (originCourses.length == 1 && originCourses[0].innerText == "조회를 하지 않았거나 조회된 데이터가 없습니다.")) {
        return;
    }                

    let newTable = $(document.createElement('tbody'));
    newTable[0].setAttribute('id', 'sortable_table');
    newTable.sortable({
        stop: (event, ui) => {
            saveOrder();
        }
    });
    
    let originTable = $('#gdMain > tbody');
    originTable[0].style.display = 'none';            
    originTable[0].insertAdjacentElement('afterend', newTable[0]);
    
    let cloneCourses = originCourses.clone(true)

    for(let i = 0; i < originCourses.length; i++) {
        cloneCourses[i].children[1].removeAttribute('class')
        cloneCourses[i].children[1].children[0].children[0].removeAttribute('id')

        let cloneTarget = cloneCourses[i].children[1].children[0].children[0];
        let succObserver = new MutationObserver((mutations, ob) => {
            for(const mutation of mutations) {
                if(mutation.type == 'attributes' && mutation.attributeName == 'style') {
                    if(mutation.target.style.display == 'none') {
                        cloneTarget.style.display = 'none';
                    }
                }
            }
        })
        
        cloneCourses[i].children[1].children[0].children[0].addEventListener('click', () => {
            originCourses[i].children[1].children[0].children[0].click();
            succObserver.observe(originCourses[i].children[1].children[0].children[0], {attributes : true});
        })
        
        cloneCourses[i].children[12].removeAttribute('class')
        cloneCourses[i].children[12].children[0].children[0].removeAttribute('id')
        cloneCourses[i].children[12].children[0].children[0].addEventListener('click', () => {
            originCourses[i].children[12].children[0].children[0].click();

        })

        cloneCourses[i].children[8].removeAttribute('class');
        cloneCourses[i].children[8].removeAttribute('id');
        cloneCourses[i].children[8].className = 'bold-type2'
        cloneCourses[i].children[8].addEventListener('click', () => {
            originCourses[i].children[8].click();
        })  

        cloneCourses[i].children[9].removeAttribute('class');
        cloneCourses[i].children[9].removeAttribute('id');
        cloneCourses[i].children[9].className = 'bold-type2'
        cloneCourses[i].children[9].addEventListener('click', () => {
            originCourses[i].children[9].click();
        })

        cloneCourses[i].children[18].removeAttribute('class');
        cloneCourses[i].children[18].removeAttribute('id');
        cloneCourses[i].children[18].className = 'bold-type2'
        cloneCourses[i].children[18].addEventListener('click', () => {
            originCourses[i].children[18].click();
        }) 

        cloneCourses[i].children[25].removeAttribute('class');
        cloneCourses[i].children[25].removeAttribute('id');
        cloneCourses[i].children[25].className = 'bold-type2 center-type'
        cloneCourses[i].children[25].addEventListener('click', () => {
            originCourses[i].children[25].click();
        })  

        cloneCourses[i].children[26].removeAttribute('class');
        cloneCourses[i].children[26].removeAttribute('id');
        cloneCourses[i].children[26].children[0].removeAttribute('id');
        cloneCourses[i].children[26].addEventListener('click', () => {
            originCourses[i].children[26].click();
        })

        cloneCourses[i].children[27].removeAttribute('class');
        cloneCourses[i].children[27].removeAttribute('id');
        cloneCourses[i].children[27].className = 'bold-type2'
        cloneCourses[i].children[27].addEventListener('click', () => {
            originCourses[i].children[27].click();
        })  
    }

    if(courseOrders.length != 0) {
        cloneCourses.sort((course1, course2) => {
            return courseOrders.indexOf(course1.children[8].innerText) - courseOrders.indexOf(course2.children[8].innerText);
        })
    }

    for(let i = 0; i < cloneCourses.length; i++) {
        //체크박스 삭제 -> 색상 대체
        cloneCourses[i].children[0].children[0].removeAttribute('name')
        cloneCourses[i].children[0].children[0].setAttribute('value', '#ffffff')
        cloneCourses[i].children[0].children[0].setAttribute('type', 'color')
        cloneCourses[i].children[0].children[0].addEventListener('input', () => {
            cloneCourses[i].style.backgroundColor = cloneCourses[i].children[0].children[0].value;
            let invert = invertColor(cloneCourses[i].children[0].children[0].value, true)
            cloneCourses[i].style.color = invert
            cloneCourses[i].children[8].style.color = invert
            cloneCourses[i].children[9].style.color = invert
            cloneCourses[i].children[18].style.color = invert
            cloneCourses[i].children[25].style.color = invert
            cloneCourses[i].children[27].style.color = invert
        })

        cloneCourses[i].addEventListener('mouseover', () => {
            cloneCourses[i].children[8].style.cursor = 'pointer'
            cloneCourses[i].children[8].style.textDecoration = 'underline'
            cloneCourses[i].children[9].style.cursor = 'pointer'
            cloneCourses[i].children[9].style.textDecoration = 'underline'
            cloneCourses[i].children[18].style.cursor = 'pointer'
            cloneCourses[i].children[18].style.textDecoration = 'underline'
            cloneCourses[i].children[25].style.cursor = 'pointer'
            cloneCourses[i].children[25].style.textDecoration = 'underline'
            cloneCourses[i].children[26].style.cursor = 'pointer'
            cloneCourses[i].children[26].style.textDecoration = 'underline'
            cloneCourses[i].children[27].style.cursor = 'pointer'
            cloneCourses[i].children[27].style.textDecoration = 'underline'
        })
        cloneCourses[i].addEventListener('mouseout', () => {
            cloneCourses[i].children[8].style.cursor = 'default'
            cloneCourses[i].children[8].style.textDecoration = 'none'
            cloneCourses[i].children[9].style.cursor = 'default'
            cloneCourses[i].children[9].style.textDecoration = 'none'
            cloneCourses[i].children[18].style.cursor = 'default'
            cloneCourses[i].children[18].style.textDecoration = 'none'
            cloneCourses[i].children[25].style.cursor = 'default'
            cloneCourses[i].children[25].style.textDecoration = 'none'
            cloneCourses[i].children[26].style.cursor = 'default'
            cloneCourses[i].children[26].style.textDecoration = 'none'
            cloneCourses[i].children[27].style.cursor = 'default'
            cloneCourses[i].children[27].style.textDecoration = 'none'
        }) 
        newTable[0].appendChild(cloneCourses[i]);
    }
    saveOrder();
}

window.addEventListener('hashchange', async() => {
    if(window.location.hash == desiredHash) {

        let originCourses;
        let failCnt = 0;

        //비동기
        while(1) {
            originCourses = $('#gdMain > tbody > tr'); 
            if(originCourses.length == 0 || (originCourses.length == 1 && originCourses[0].innerText == "조회를 하지 않았거나 조회된 데이터가 없습니다.")) {
                failCnt++;
                if(failCnt == 5) {
                    return;
                }
                await sleep(200);
            }                
            else {
                break;
            }
        }

        if(navigator.userAgent.indexOf("Firefox") == -1) {
            courseOrders = (await chrome.storage.local.get(['saved'])).saved ?? [];
        }
        else {
            courseOrders = (await browser.storage.local.get(['saved'])).saved ?? [];
        }
        
        let resetBtn = document.createElement('input');
        resetBtn.setAttribute('type', 'button');
        resetBtn.className = '{ "color" : "skyblue" } btn_common btn_skyblue btn_small';
        resetBtn.value = '순서 초기화';
        
        resetBtn.addEventListener('click', () => {
            $('#sortable_table').remove();
            courseOrders = [];
            sortDesiredCourse();
        })

        let timeTableBtn = $('.hyinTemplate > ul > li > span');
        timeTableBtn[0].children[0].style.display = 'none';
        timeTableBtn[0].appendChild(resetBtn);

        observer.observe($('#gdMain > tbody')[0], {childList: true, subtree: false});
        sortDesiredCourse();
    }
    else {
        observer.disconnect();
    }


})


//https://stackoverflow.com/questions/35969656
function invertColor(hex, bw) {
    if (hex.indexOf('#') === 0) {
        hex = hex.slice(1);
    }
    // convert 3-digit hex to 6-digits.
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
        throw new Error('Invalid HEX color.');
    }
    var r = parseInt(hex.slice(0, 2), 16),
        g = parseInt(hex.slice(2, 4), 16),
        b = parseInt(hex.slice(4, 6), 16);
    if (bw) {
        // https://stackoverflow.com/a/3943023/112731
        return (r * 0.299 + g * 0.587 + b * 0.114) > 186
            ? '#000000'
            : '#FFFFFF';
    }
    // invert color components
    r = (255 - r).toString(16);
    g = (255 - g).toString(16);
    b = (255 - b).toString(16);
    // pad each with zeros and return
    return "#" + padZero(r) + padZero(g) + padZero(b);
}
