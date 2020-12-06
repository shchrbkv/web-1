const input = document.getElementById("input"),
    output = document.getElementById("output"),
    history = document.getElementById("history"),
    toolset = document.getElementById("toolset");

let historyList = document.getElementsByClassName("previous");
let toHistory = () => {
    if (res && input.value.length !== 0){
        let previous = document.createElement("p");
        previous.classList.add("previous");
        previous.innerHTML = input.value+"<b>"+output.innerText+"</b><i>↺</i>";
        previous.addEventListener("click", fromHistory);
        history.appendChild(previous);
        input.value = output.innerText.split("=")[1];
        //input.selectionStart = 0;
        //input.selectionEnd = input.value.length;
    }
};
let fromHistory = (e) => {
    input.dispatchEvent(new Event("focus"));
    input.selectionStart = input.selectionEnd = input.value.length;
    let expression = e.target.innerText.split("=")[0];
    if (input.value !== output.innerText.split("=")[1]) toHistory();
    input.value = expression;
    update();
};

input.addEventListener("focus", () => {
    historyList[0].classList.add("visible");
    toolset.classList.add("visible");
});
input.addEventListener("blur", () => {
    historyList[0].classList.remove("visible");
    toolset.classList.remove("visible");
});

let res = false, fade,
    update = (e) =>{
        if (input.value.length !== 0) {
            clearTimeout(fade);
            try {
                let expression = math.evaluate(input.value);
                if (typeof expression == "number")
                    output.innerText = "=" + Math.round((expression + Number.EPSILON) * 10000000) / 10000000;
                else throw "Operation is unsupported";
                res = true;
            }
            catch (err) {
                output.innerText = "=???";
                res = false;
            }
        }
        else {
            output.innerText = "\xa0";
            fade = setTimeout(() => input.blur(), 3000);
        }
    };

input.addEventListener("input", update);

document.addEventListener("keydown", (e) => {
    input.focus();
    if (input.value.length !== 0) {
        if (e.code === "Enter") {
            toHistory();
            if (!res) {
                setTimeout(() => output.classList.add("error"), 10);
                output.classList.remove("error");
            }
        }
    }
});

let toolsetList = document.getElementsByClassName("func"),
    funcDict = {
        "x\u207F": "^()",
        "\u221A": "sqrt()",
        "ln": "log()",
        "log\u2081\u2080": "log10()",
        "sin": "sin()",
        "cos": "cos()",
        "tan": "tan()",
        "e\u207F": "exp()",
        "\u03C0": "pi",
        "!": "()!"
    };

let insert = (e) => {
    let func = funcDict[e.target.innerText],
        line = input.value,
        selS = input.selectionStart,
        selE = input.selectionEnd;
    console.log(func);
    line = line.slice(0, selS)+func+line.slice(selE);
    console.log(line);
    input.value = line;
    input.focus();
    if (func.includes("()"))
        input.selectionStart = input.selectionEnd = selS+func.indexOf(")");
    else
        input.selectionStart = input.selectionEnd = selS+func.length;
    update();
};

toolset.addEventListener("click", insert);
