var nbErreur = 0;
var lesTouches = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var leMot = ["word", "hint"];
var motRestant = [];
var niveauJeu, laLangue, opJeu_indication, opJeu_Aide, opJeu_Enlever5Lettres;
var jouerSon = true;

const audioLettreFausse = document.getElementById('lettre_fausse');
const audioLettreJuste = document.getElementById('lettre_juste');
const audioJeuEchec = document.getElementById('jeu_echec');
const audioJeuSucces = document.getElementById('jeu_succes');
const audioNotification = document.getElementById('notification');


function demanderUnMot(laLangue, laDifficulte) {
    // We use here FETCH and REST-API

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

        laTouche.style.transitionDuration = "1s";
        laTouche.style.transform = "rotateY(0.5turn)";

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
            } else {
                // On joue le son de "lttre juste", sauf pour la dernière lettre
                if (jouerSon) audioLettreJuste.play();
            };
        } else {
            afficherProchaineErreur();
        };

        
        // laTouche.style.transitionDuration = "0s";
        laTouche.style.transform = "rotateY(1turn)";
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

    if (nbErreur < 10) {
        // Lettre fausse
        if (jouerSon) audioLettreFausse.play();
    } else {
        // La dernière lettre, l'homme est pendu
        if (jouerSon) audioJeuEchec.play();
    };

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
            if (niveauJeu != 'H') {
                if (opJeu_Aide) {
                    if (jouerSon) audioNotification.play();
                    document.getElementById("boutonAide").setAttribute("data","true");
                }
            };
            break;
        case 6:
            document.getElementById("img-pendu").setAttribute("src", "../../static/LePendu06.png");
            break;
        case 7:
            document.getElementById("img-pendu").setAttribute("src", "../../static/LePendu07.png");
            break;
        case 8:
            document.getElementById("img-pendu").setAttribute("src", "../../static/LePendu08.png");
            if (opJeu_Enlever5Lettres) {
                if (jouerSon) audioNotification.play();
                document.getElementById("boutonEnlever5Lettres").setAttribute("data","true");
            };
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


// function wait(ms) {
//     var start = Date.now(),
//         now = start;
//     while (now - start < ms) {
//       now = Date.now();
//     }
// };

function goAnimation() {
        document.getElementById("img-pendu2").setAttribute("data","true");
}


function finDuJeu(lOk) {
    var divResultat = document.getElementById("resultat");
    
    document.getElementById("definition").setAttribute("data","false");
    document.getElementById("boutonAide").setAttribute("data","false");
    document.getElementById("texteAide").setAttribute("data","false");
    document.getElementById("boutonEnlever5Lettres").setAttribute("data","false");
    
    divResultat.setAttribute("data", lOk);


    if (lOk) {
        // * ----------------------------------------------- SUCCES
        if (jouerSon) audioJeuSucces.play();
        if (laLangue == 'F') {
            document.getElementById("resultatTitre").innerText = "Gagné !";
            document.getElementById("resultatCorps").innerHTML = "Bravo, vous avez trouvé le mot.";
        } else {
            document.getElementById("resultatTitre").innerText = "You won !";
            document.getElementById("resultatCorps").innerHTML = "Congratulations, you found the word.";
        };
        document.getElementsByTagName("body")[0].style.backgroundColor = "rgba(83, 234, 83, 0.5)";
    } else {
        // * ----------------------------------------------- ECHEC
        // Le son JeuEchec est joué à la 10e erreur (donc il est déjà joué lorsqu'on arrive ici)
        if (laLangue == 'F') {
            document.getElementById("resultatTitre").innerText = "Perdu !";
            document.getElementById("resultatCorps").innerHTML = "Le mot est <b>\"" + leMot[0].toUpperCase() + "\"</b><br>Bonne chance pour la prochaine fois.";
        } else {
            document.getElementById("resultatTitre").innerText = "You lost !";
            document.getElementById("resultatCorps").innerHTML = "The word is <b>\"" + leMot[0].toUpperCase() + "\"</b><br>Good luck next time.";
        };

        // document.getElementById("pendu").setAttribute("data","false");
        document.getElementById("pendu2").setAttribute("data","true");
        document.getElementById("img-pendu").setAttribute("src", "../../static/LePendu12.png");
        // document.getElementById("img-pendu2").setAttribute("data","true");
        setTimeout(goAnimation,200);

        document.getElementsByTagName("body")[0].style.backgroundColor = "rgba(234, 57, 57, 0.5)";
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
    document.getElementById("texteAide").innerHTML = "&nbsp;&nbsp;&nbsp;("+leMot[1]+")";    
    document.getElementById("texteAide").setAttribute("data","true");
    document.getElementById("boutonAide").setAttribute("data","false");
};

function enlever5Lettres() {
    retirerCinqLettres();
    document.getElementById("boutonEnlever5Lettres").setAttribute("data","false");
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


function desactiverAideSiNecessaire() {
    // Si on désacive l'indication (définition) alors on désactive l'aide
    if (! document.getElementById("indicationJeu").checked) {
        document.getElementById("aideJeu").checked = false;
    }
}


function initJeu() {
    nbErreur = 0;
    motRestant = [];

    document.getElementsByTagName("body")[0].style.backgroundColor = "rgba(240, 232, 174, 0.8)";

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
        if (laLangue == 'F') {
            libNiveauJeu = "Moyen";
        } else {
            libNiveauJeu = "Medium";
        }
    } else {
        niveauJeu = document.getElementById("difficile").value
        if (laLangue == 'F') {
            libNiveauJeu = "Difficile";
        } else {
            libNiveauJeu = "Hard";
        }
    };
    document.getElementById("niveauJeuChoisi").innerHTML = " ("+libNiveauJeu+")";

    // options du jeu
    opJeu_indication = document.getElementById("indicationJeu").checked;
    opJeu_Aide = document.getElementById("aideJeu").checked;
    opJeu_Enlever5Lettres = document.getElementById("supp5Jeu").checked;

    if (opJeu_indication) {
        document.getElementById("definition").setAttribute("data","true");
    } else {
        document.getElementById("definition").setAttribute("data","false");
    };

    document.getElementById("pendu2").setAttribute("data","false");
    document.getElementById("pendu2").style.top = 0;
    document.getElementById("img-pendu2").setAttribute("data","false");

    demanderUnMot(laLangue, niveauJeu);    // theLang, theDifficulty
};

function demarrerJeu(LangueDuJeu) {
    // console.log('langue (demarrerJeu)',LangueDuJeu);
    laLangue = LangueDuJeu;
    document.getElementById("boutonJouer").setAttribute("data", "false");
    document.getElementById("niveauDeJeu").setAttribute("data", "false");
    document.getElementById("assistanceAuJeu").setAttribute("data", "false");
    document.getElementById("img-pendu").setAttribute("src", "../../static/LePendu00.png");
    document.getElementById("resultat").setAttribute("data", "");
    document.getElementById("texteAide").setAttribute("data","false");
    document.getElementById("boutonAide").setAttribute("data","false");
    document.getElementById("boutonEnlever5Lettres").setAttribute("data","false");
    initJeu();
};


function changerSon() {
    let boutonSon = document.getElementById("bouton-son");
    if (boutonSon.classList.contains('bi-bell-fill')) {
        jouerSon = false;
        boutonSon.classList.replace('bi-bell-fill','bi-bell-slash-fill');
        // console.log('bi-bell-fill -> bi-bell-slash-fill');
    } else {
        jouerSon = true;
        boutonSon.classList.replace('bi-bell-slash-fill','bi-bell-fill');
        // console.log('bi-bell-slash-fill -> bi-bell-fill');
    };
};