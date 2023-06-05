var nbErreur = 0;
var lesTouches = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var leMot = ["word", "hint"];
var motRestant = [];
var niveauJeu;


function demanderUnMot(laLang, laDifficulte) {
    // We use here FETCH and REST-API

    let url = window.location.origin + '/api/word/' + laLang + '/' + laDifficulte;
    // window.location.origin   =>   'http://127.0.0.1:8000'
    // window.location.host   =>   '127.0.0.1:8000'
    // window.location.pathname   =>   '/api/word/F/N'
    fetch(url)
        .then(resp => resp.json())
        .then(function (data) {
            document.getElementById("definition").innerHTML = data['definition'];
            // document.getElementById("texteAide").innerHTML = "&nbsp;&nbsp;&nbsp;("+data['hint']+")";
            // data['word'];
            // data['definition'];
            // data['hint'];
            leMot[0] = data['word'];
            leMot[1] = data['hint'];
            // console.log('word:', leMot[0]);
            creerEspaceMot();
        })
        .catch(erreur => {
            document.getElementById("definition").innerHTML = '*** Problème avec serveur ***';
            leMot[0] = 'X';
            leMot[1] = 'X';
        })
};

function creerEspaceMot() {
    var lesLettresOuJour = document.getElementById("lettersEspaceJeu");
    lesLettresOuJour.innerHTML = "";

    for (i = 0; i < leMot[0].length; i++) {
        var lTexte = leMot[0][i].toUpperCase();
        var lettre = document.createElement("span");
        if (lTexte == " ") { lettre.className = "lettreEspace" }
        else { lettre.className = "lettre" };
        lettre.innerHTML = "&nbsp"
        lettre.id = "lettre_" + i;
        lesLettresOuJour.appendChild(lettre);

        if (lTexte != " ") {
            if (motRestant.indexOf(lTexte) == -1) {
                motRestant.push(lTexte);
            }
        }
    }
};


function creerClavier() {
    var elemClavier = document.getElementById("clavier");
    elemClavier.innerHTML = "";
    for (i = 0; i < lesTouches.length; i++) {
        var uneTouche = document.createElement("span");
        uneTouche.className = "touche";
        uneTouche.innerText = lesTouches[i];
        uneTouche.setAttribute("data", "");
        uneTouche.onclick = function () {
            verifierJeu(this)
        };
        elemClavier.appendChild(uneTouche);
    };
    elemClavier.setAttribute("data", "true");
};


function verifierJeu(laTouche) {
    if (laTouche.getAttribute("data") == "") {   // Touche non encore jouée
        var lettreExiste = false;
        var position = motRestant.indexOf(laTouche.innerText.toUpperCase());
        if (position != -1) {
            motRestant.splice(position, 1);
            afficherLettre(laTouche.innerText.toUpperCase());
            lettreExiste = true;
        };
        laTouche.setAttribute("data", lettreExiste)
        if (lettreExiste) {
            if (motRestant.length == 0) {
                finDuJeu(true);
            }
        } else {
            afficherProchaineErreur();
        };
    };
};

// function verifierJeu(laTouche) {
//     if (laTouche.getAttribute("data") == "") {   // Touche non encore jouée
//         var lettreExiste = voirSiLettreExiste(laTouche.innerText);
//         laTouche.setAttribute("data", lettreExiste)
//         if (lettreExiste) {
//             if (motRestant.length == 0) {
//                 finDuJeu(true);
//             }
//         } else {
//             afficherProchaineErreur();
//         }
//     }
// };

// function voirSiLettreExiste(laLettre) {
//     laLettre = laLettre.toUpperCase()
//     var position = motRestant.indexOf(laLettre);
//     if (position != -1) {
//         motRestant.splice(position, 1);
//         afficherLettre(laLettre);
//         return true;
//     }
//     return false;
// };

function afficherLettre(laLettre) {
    for (i = 0; i < leMot[0].length; i++) {
        if (leMot[0][i].toUpperCase() == laLettre) {
            document.getElementById("lettre_" + i).innerText = laLettre;
        }
    }
};

function afficherProchaineErreur() {
    nbErreur++;
    switch (nbErreur) {
        case 1:
            document.getElementById("img-pendu").setAttribute("src", "../static/LePendu01.png");
            break;
        case 2:
            document.getElementById("img-pendu").setAttribute("src", "../static/LePendu02.png");
            break;
        case 3:
            document.getElementById("img-pendu").setAttribute("src", "../static/LePendu03.png");
            break;
        case 4:
            document.getElementById("img-pendu").setAttribute("src", "../static/LePendu04.png");
            break;
        case 5:
            document.getElementById("img-pendu").setAttribute("src", "../static/LePendu05.png");
            if (niveauJeu != 'H') {
                document.getElementById("boutonAide").setAttribute("data","true");
            };
            break;
        case 6:
            document.getElementById("img-pendu").setAttribute("src", "../static/LePendu06.png");
            break;
        case 7:
            document.getElementById("img-pendu").setAttribute("src", "../static/LePendu07.png");
            break;
        case 8:
            document.getElementById("img-pendu").setAttribute("src", "../static/LePendu08.png");
            break;
        case 9:
            document.getElementById("img-pendu").setAttribute("src", "../static/LePendu09.png");
            break;
        case 10:
            document.getElementById("img-pendu").setAttribute("src", "../static/LePendu10.png");
            finDuJeu(false);
            break;
    };
};

function finDuJeu(lOk) {
    var divResultat = document.getElementById("resultat");
    divResultat.setAttribute("data", lOk);
    if (lOk) {
        document.getElementById("resultatTitre").innerText = "Gagné !";
        document.getElementById("resultatCorps").innerHTML = "Bravo, vous avez trouvé le mot.";
    } else {
        document.getElementById("resultatTitre").innerText = "Perdu !";
        document.getElementById("resultatCorps").innerHTML = "Le mot est <b>\"" + leMot[0].toUpperCase() + "\"</b><br>Bonne chance pour la prochaine fois.";
    };
    document.getElementById("clavier").setAttribute("data", "false");
    document.getElementById("boutonJouer").innerHTML = "Rejouer";
    document.getElementById("boutonJouer").setAttribute("data", "true");
    document.getElementById("niveauDeJeu").setAttribute("data", "true");
};

function afficherAide() {
    document.getElementById("texteAide").innerHTML = "&nbsp;&nbsp;&nbsp;("+leMot[1]+")";    
    document.getElementById("texteAide").setAttribute("data","true");
    document.getElementById("boutonAide").setAttribute("data","false");
};

function initJeu() {
    nbErreur = 0;
    motRestant = [];
    creerClavier();

    var libNiveauJeu;
    if (document.getElementById("facile").checked) {
        niveauJeu = document.getElementById("facile").value;
        libNiveauJeu = "Facile";
    } else if (document.getElementById("normal").checked) {
        niveauJeu = document.getElementById("normal").value;
        libNiveauJeu = "Normal";
    } else {
        niveauJeu = document.getElementById("difficile").value
        libNiveauJeu = "Difficile";
    };
    document.getElementById("niveauJeuChoisi").innerHTML = " ("+libNiveauJeu+")";

    demanderUnMot('F', niveauJeu);    // theLang, theDifficulty
};

function demarrerJeu() {
    document.getElementById("boutonJouer").setAttribute("data", "false");
    document.getElementById("niveauDeJeu").setAttribute("data", "false");
    document.getElementById("img-pendu").setAttribute("src", "../static/LePendu00.png");
    document.getElementById("resultat").setAttribute("data", "");
    document.getElementById("texteAide").setAttribute("data","false");
    document.getElementById("boutonAide").setAttribute("data","false");
    initJeu();
};
