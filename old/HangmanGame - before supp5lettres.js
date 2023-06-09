var nbErreur = 0;
var lesTouches = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var leMot = ["word", "hint"];
var motRestant = [];
var niveauJeu;
var laLangue;

function demanderUnMot(laLangue, laDifficulte) {
    // We use here FETCH and REST-API
    // console.log('langue (demanderUnMot)',laLangue);

    let url = window.location.origin + '/api/word/' + laLangue + '/' + laDifficulte;
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
            if (laLangue == 'F') {
                document.getElementById("definition").innerHTML = '*** Problème avec le serveur ***';
            } else {
                document.getElementById("definition").innerHTML = '*** Problem with the server ***';
            }
            leMot[0] = 'X';
            leMot[1] = 'X';
        })
};


function creerEspaceMot() {
    var lesLettresOuJour = document.getElementById("lettersEspaceJeu");
    lesLettresOuJour.innerHTML = "";

    for (i = 0; i < leMot[0].length; i++) {
        var lTexte = leMot[0][i].toUpperCase();
        if (laLangue == 'F') {
            lTexte = transformerAccent(lTexte)
        };
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
    // console.log('motRestant:',motRestant);
};

function transformerAccent(lettre) {
    // pour le FRANCAIS
    if ((lettre == 'É') || (lettre == 'È') || (lettre == 'Ê')) {
        return 'E'
    } else {
        if ((lettre == 'À') || (lettre == 'Â')) {
            return 'A';
        } else {
            if (lettre == 'Ô') {
                return 'O';
            } else {
                if ((lettre == 'Ù') || (lettre == 'Û')) {
                    return 'U';
                } else {
                    return lettre;
                }
            }
        }
    }
}

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
        laTouche.setAttribute("data", lettreExiste);
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
        } else {
            if (laLangue == 'F') {
                if (transformerAccent(leMot[0][i]).toUpperCase() == laLettre) {
                    document.getElementById("lettre_" + i).innerText = leMot[0][i].toUpperCase();
                }
            }
        }
    }
};

function afficherProchaineErreur() {
    nbErreur++;
    switch (nbErreur) {
        case 1:
            document.getElementById("img-pendu").setAttribute("src", "../../static/LePendu01.png");
            break;
        case 2:
            document.getElementById("img-pendu").setAttribute("src", "../../static/LePendu02.png");
            break;
        case 3:
            document.getElementById("img-pendu").setAttribute("src", "../../static/LePendu03.png");
            break;
        case 4:
            document.getElementById("img-pendu").setAttribute("src", "../../static/LePendu04.png");
            break;
        case 5:
            document.getElementById("img-pendu").setAttribute("src", "../../static/LePendu05.png");
            // if (niveauJeu != 'H') {
                document.getElementById("boutonAide").setAttribute("data","true");
            // };
            break;
        case 6:
            document.getElementById("img-pendu").setAttribute("src", "../../static/LePendu06.png");
            break;
        case 7:
            document.getElementById("img-pendu").setAttribute("src", "../../static/LePendu07.png");
            break;
        case 8:
            document.getElementById("img-pendu").setAttribute("src", "../../static/LePendu08.png");
            break;
        case 9:
            document.getElementById("img-pendu").setAttribute("src", "../../static/LePendu09.png");
            break;
        case 10:
            document.getElementById("img-pendu").setAttribute("src", "../../static/LePendu10.png");
            finDuJeu(false);
            break;
    };
};

function finDuJeu(lOk) {
    var divResultat = document.getElementById("resultat");
    divResultat.setAttribute("data", lOk);
    // console.log('langue (finDuJeu)',laLangue);
    if (lOk) {
        if (laLangue == 'F') {
            document.getElementById("resultatTitre").innerText = "Gagné !";
            document.getElementById("resultatCorps").innerHTML = "Bravo, vous avez trouvé le mot.";
        } else {
            document.getElementById("resultatTitre").innerText = "You won !";
            document.getElementById("resultatCorps").innerHTML = "Congratulations, you found the word.";
        };
    } else {
        if (laLangue == 'F') {
        document.getElementById("resultatTitre").innerText = "Perdu !";
        document.getElementById("resultatCorps").innerHTML = "Le mot est <b>\"" + leMot[0].toUpperCase() + "\"</b><br>Bonne chance pour la prochaine fois.";
    } else {
            document.getElementById("resultatTitre").innerText = "You lost !";
            document.getElementById("resultatCorps").innerHTML = "The word is <b>\"" + leMot[0].toUpperCase() + "\"</b><br>Good luck next time.";
        };
    };
    document.getElementById("clavier").setAttribute("data", "false");
    if (laLangue == 'F') {
        document.getElementById("boutonJouer").innerHTML = "Rejouer";
    } else {
        document.getElementById("boutonJouer").innerHTML = "Replay";
    };
    document.getElementById("boutonJouer").setAttribute("data", "true");
    document.getElementById("niveauDeJeu").setAttribute("data", "true");
};


function afficherAide() {
    if (niveauJeu != 'H') {
        document.getElementById("texteAide").innerHTML = "&nbsp;&nbsp;&nbsp;("+leMot[1]+")";    
        document.getElementById("texteAide").setAttribute("data","true");
    } else {
        retirerCinqLettres();
    }
    document.getElementById("boutonAide").setAttribute("data","false");
};


function nombreAleatoire(max) {
  return Math.floor(Math.random() * max);
}

function retirerCinqLettres() {
    // console.log('retirerCinqLettres',motRestant);

    let lettresNonUtilisees_Et_NonPartieDuMot = [], indice;
    let elemClavier = document.getElementById("clavier");

    indice = 0;
    for (const child of elemClavier.children) {
        if (motRestant.indexOf(child.innerText.toUpperCase()) == -1) {   // ne fait pas partie du mot
            if (child.getAttribute("data") == "") {   // Touche non encore jouée
                lettresNonUtilisees_Et_NonPartieDuMot.push(indice);
            }
        };
        indice += 1;
    }

    for (let i = 0; i < 5; i++) {
        // On choisit un nombre aléatoire parmis les indices des touches non utilisées et qui ne font pas partie du mot.
        // Ce nombre aléatoire représente l'indice de la touche à désactiver (comme aide).
        let pos = nombreAleatoire(lettresNonUtilisees_Et_NonPartieDuMot.length);
        elemClavier.children[lettresNonUtilisees_Et_NonPartieDuMot[pos]].setAttribute("data", false);
        lettresNonUtilisees_Et_NonPartieDuMot.splice(pos,1);
    };
};


function initJeu() {
    nbErreur = 0;
    motRestant = [];
    creerClavier();

    // console.log('langue (initJeu)',laLangue);

    var libNiveauJeu;
    if (document.getElementById("facile").checked) {
        niveauJeu = document.getElementById("facile").value;
        if (laLangue == 'F') {
            libNiveauJeu = "Facile";
        } else {
            libNiveauJeu = "Easy";
        }
    } else if (document.getElementById("normal").checked) {
        niveauJeu = document.getElementById("normal").value;
        libNiveauJeu = "Normal";
    } else {
        niveauJeu = document.getElementById("difficile").value
        if (laLangue == 'F') {
            libNiveauJeu = "Difficile";
        } else {
            libNiveauJeu = "Difficult";
        }
    };
    document.getElementById("niveauJeuChoisi").innerHTML = " ("+libNiveauJeu+")";

    demanderUnMot(laLangue, niveauJeu);    // theLang, theDifficulty
};

function demarrerJeu(LangueDuJeu) {
    // console.log('langue (demarrerJeu)',LangueDuJeu);
    laLangue = LangueDuJeu;
    document.getElementById("boutonJouer").setAttribute("data", "false");
    document.getElementById("niveauDeJeu").setAttribute("data", "false");
    document.getElementById("img-pendu").setAttribute("src", "../../static/LePendu00.png");
    document.getElementById("resultat").setAttribute("data", "");
    document.getElementById("texteAide").setAttribute("data","false");
    document.getElementById("boutonAide").setAttribute("data","false");
    initJeu();
};
