function secs(s){
    var subs = s.split(":");
    var sum = 0;

    for (i = 0; i<subs.length; i++){
        sum *= 60;
        sum += parseInt(subs[i]);
    }
    return sum;
}

function pureNum(s){
    return parseFloat(s.match(/[\d|,|.|e|E|\+]+/g)[0])
}

function seconds2time (seconds) {
    seconds = Math.round(seconds);
    var hours   = Math.floor(seconds / 3600);
    var minutes = Math.floor((seconds - (hours * 3600)) / 60);
    var seconds = seconds - (hours * 3600) - (minutes * 60);
    var time = "";

    if (hours != 0) {
        time = hours+":";
    }
    if (minutes != 0 || time !== "") {
        minutes = (minutes < 10 && time !== "") ? "0"+minutes : String(Math.round(minutes));
        time += minutes+":";
    }
    if (time === "") {
        time = seconds;
    }
    else {
        time += (seconds < 10) ? "0"+seconds : String(Math.round(seconds));
    }
    return time;
}

function evalu(A2, B2){
    if (A2 === "") return "";
    if (B2 === "") B2 = "0";

    A2 = secs(A2)
    B2 = pureNum(B2)

    return seconds2time(A2 + A2*(100-B2)/100);
}

event.value = evalu(this.getField("a").valueAsString,this.getField("b").valueAsString)