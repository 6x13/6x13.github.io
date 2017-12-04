var s = Snap("#canvas");
Snap.load("res/logo.svg", function (f) {
    o = f.selectAll("#overlay path");
    o.forEach(function (g) {
        g.animate({fillOpacity: 1}, Math.random()*10000, mina.bounce, function (h) {
            g.animate({fillOpacity: 0.75}, Math.random()*5000, mina.bounce)})});
    t = f.select("#text");
    t.animate({fillOpacity: 1}, 1000, mina.bounce);
    s.append(f);
});
