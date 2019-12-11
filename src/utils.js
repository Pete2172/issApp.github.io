
export function formatInput(input, name){
    let formate;
    let num;
        switch(name){
            case "Date & Time":
                let date = new Date(input*1000);
                formate = date.toLocaleDateString() + ", " 
                        + date.toLocaleTimeString();
                break;
            case "Longitude":
                num = Number(input).toFixed(2);
                formate = (num < 0) ? num*(-1) + "\xB0 W" : num + "\xB0 E";
                break;
            case "Latitude":
                num = Number(input).toFixed(2);
                formate = (num < 0) ? num*(-1) + "\xB0 S" : num + "\xB0 N";
                break;
            case "Altitude":
                num = Number(input).toFixed(2);
                formate = num + " km";
                break;
            case "Velocity":
                num = Number(input).toFixed(2);
                formate = num + " km/h";
                break;
        }
    return formate;
} 

export function calculateGreatCircleDistance(lat1, lon1, lat, lon){
    lat1 *= Math.PI/180;
    lon1 *= Math.PI/180;
    lat *= Math.PI/180;
    lon *= Math.PI/180;

    return Math.acos((Math.sin(lat1)*Math.sin(lat) +(Math.cos(lat1)*Math.cos(lat)*Math.cos(lon1-lon)))) * (180/Math.PI);
}

