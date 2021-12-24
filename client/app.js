
function $(elm) {
    return document.querySelector(elm)
}

const http = {
    error: (msg) => {
        if (msg) throw new Error("error msg is empty");

        throw new Error(msg)
    },
    get: (url) => {
        if (!url) {
            http.error("Url is missing")
        }
        return new Promise((res, rej) => {
            try {
                fetch(url, {
                    method: "get",
                    headers: {
                        "content-type": "application/json"
                    },
                })
                    .then((res) => {
                        return res.json()
                    })
                    .then((data) => {
                        return res(data)
                    })
                    .catch((err) => {
                        return rej(err)
                    })
            } catch (err) {
                return rej("Server Error: Failed to compile")
            }
        })
    },
    post: (url, data) => {
        if (!url || !data) {
            http.error("post request required valid inputs fields: url & body")
        }
        return new Promise((res, rej) => {
            try {
                fetch(url, {
                    method: "post",
                    headers: {
                        "content-type": "application/json"
                    },
                    body: JSON.stringify(data)
                })
                    .then((res) => {
                        return res.json()
                    })
                    .then((data) => {
                        return res(data)
                    })
                    .catch((err) => {
                        return rej(err)
                    })
            } catch (err) {
                return rej("Server Error: Failed to compile")
            }
        })
    }
}

const url = "http://localhost:5000"


async function init() {
    // select elm
    let textInp = $(".code");
    let runBtn = $(".run-btn");
    let checkInput = $(".check-input");
    let outputCode = $("#outputcode");
    let javaInput = $(".javaInput");
    let loading = false;

    checkInput.onclick = () => {
        javaInput.classList.toggle("visibility")
    }

    // store code from localstorage in textarea initially
    textInp.value = JSON.parse(localStorage.getItem("javaCode")).code

    if (localStorage.getItem("javaCode") === null) {
        localStorage.setItem("javaCode", JSON.stringify({ code: textInp.value }));
    }

    // toggle input
    checkInput.onclick = (e) => {
        let check = checkInput.checked;
        javaInput.classList.toggle("visibility")
    }

    // enable tab key spacing
    textInp.addEventListener("keydown", (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            var start = textInp.selectionStart;
            var end = textInp.selectionEnd;

            console.log(start, end)

            // set textarea value to: text before caret + tab + text after caret
            textInp.value = textInp.value.substring(0, start) +
                "\t" + textInp.value.substring(end);

            // put caret at right position again
            textInp.selectionStart = textInp.selectionEnd = start + 1;
        }
    })

    runBtn.onclick = async () => {
        localStorage.setItem("javaCode", JSON.stringify({ code: textInp.value }));

        if (checkInput.checked === true) {
            await compileJavaCodeWithInput()
            return
        }
        else {
            await compileJavaCode()
            return
        }
    }

    async function compileJavaCode() {
        let codeText = textInp.value;

        if (codeText === "") {
            alert("input is empty")
            return
        }

        try {
            loading = true;
            runBtn.innerHTML = "Compiling..."
            outputCode.innerHTML = "Compiling"
            let data = await http.post(`${url}/compileJava`, { code: codeText, ext: "java" }).catch((err) => {
                return err
            })
            // console.log(outputCode)
            runBtn.innerHTML = "Run Code"

            if (data.output) {
                outputCode.classList.remove("error")
                outputCode.classList.add("success")
                outputCode.innerHTML = data.output;
                loading = false;
                return;
            }
            else if (data.errorMsg) {
                outputCode.classList.remove("success")
                outputCode.classList.add("error")
                outputCode.innerHTML = data.errorMsg;
                loading = false;
                return;
            }
            else {
                outputCode.classList.remove("success")
                outputCode.classList.add("error")
                outputCode.innerHTML = "Something went wrong compiling";
                loading = false;
            }
        }
        catch (err) {
            console.log(err)
            outputCode.classList.remove("success")
            outputCode.classList.add("error")
            outputCode.innerHTML = "Server Error: Failed to compile";
            loading = false;
        }
    }

    async function compileJavaCodeWithInput() {
        let codeText = textInp.value;

        if (codeText === "" || javaInput.value === "") {
            alert("input is empty")
            return
        }

        try {
            loading = true;
            runBtn.innerHTML = "Compiling..."
            outputCode.innerHTML = "Compiling"
            let data = await http.post(`${url}/compileJavaInput`, { code: codeText, ext: "java", input: javaInput.value }).catch((err) => {
                return err
            })
            // console.log(outputCode)
            runBtn.innerHTML = "Run Code"

            if (data.output) {
                outputCode.classList.remove("error")
                outputCode.classList.add("success")
                outputCode.innerHTML = data.output;
                loading = false;
                return;
            }
            else if (data.errorMsg) {
                outputCode.classList.remove("success")
                outputCode.classList.add("error")
                outputCode.innerHTML = data.errorMsg;
                loading = false;
                return;
            }
            else {
                outputCode.classList.remove("success")
                outputCode.classList.add("error")
                outputCode.innerHTML = "Something went wrong compiling";
                loading = false;
            }
        }
        catch (err) {
            console.log(err)
            outputCode.classList.remove("success")
            outputCode.classList.add("error")
            outputCode.innerHTML = "Server Error: Failed to compile";
            loading = false;
        }
    }
}

init()