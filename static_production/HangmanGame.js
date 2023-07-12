var nbErreur = 0;
var lesTouches = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var leMot = ["word", "hint"];
var motRestant = [];
var niveauJeu, laLangue, opJeu_indication, opJeu_Aide, opJeu_Enlever5Lettres;
var jouerSon = true;
// * idea 10/07/2023 with cookies: var histWordsHangman = lireHistWordsHangman();
var histWordsHangman, todayHistWordsHangman;

const p_MaxLengthOf_todayHistWordsHangman_ToSend = 300;
const p_MaxNbTimesChecking_NbTiragesExistantDans_TodayHist = 100;
const p_MaxNbTimesChecking_NbTiragesExistantDans_AllHist = 10;

const audioLettreFausse = document.getElementById('lettre_fausse');
const audioLettreJuste = document.getElementById('lettre_juste');
const audioJeuEchec = document.getElementById('jeu_echec');
const audioJeuSucces = document.getElementById('jeu_succes');
const audioNotification = document.getElementById('notification');


function lireHistWordsHangman() {
    // console.log('laLangue=',laLangue,' niveauJeu=',niveauJeu);
    let histhangman = localStorage.getItem('histhangman_'+laLangue+'_'+niveauJeu);   // Une liste par langue et par niveau
    // format: ;<mot>:<date-choisi>;<mot>:<date-choisi>;...    où date-choisi a le format: aaaa-mm-jj
    // Le dernier mot ne contient pas de ';'
    
    let now = new Date();
    let aujourdhui = new Date(Date.parse( now.toISOString().slice(0,10) ));   // au format aaaa-mm-jj (sans l'heure)
    
    let new_histhangman = '';
    todayHistWordsHangman = ',';   // Les mots joués aujourd'hui, format: *mot*mot*...*mot*

    if (histhangman != null) {
        histhangman = decodeURIComponent(histhangman);
        listeMots =  histhangman.split(';');
        // Filtrer les mots qui ont expiré (plus d'1 mois)
        for (let i = 1; i < listeMots.length; i++) {   // i commence à 1 au lieu de 0 pour sauter le 1er élément vide à cause du 1er ';'
            const element = listeMots[i];
            unMot = element.split(':')[0];
            uneDateChoisi = new Date(Date.parse( element.split(':')[1] ));

            let dateExpiration = new Date(uneDateChoisi);
            dateExpiration = new Date(dateExpiration.setMonth(dateExpiration.getMonth()+1));   // Date d'expiration = 1 mois

            // console.log('unMot=',unMot,' , uneDateChoisi=',uneDateChoisi);
            if (dateExpiration.valueOf() > aujourdhui.valueOf()) {
                // Le mois n'a pas encore expiré

                // if (new_histhangman != ';') {
                //     // Le dernier mot ne contient pas de ';'
                //     new_histhangman += ';';
                // };

                // On commence par ';' pour que tous les mots soient encadrés entre ';' et ':' , comme ça quand on chercher si un mot existe on ne risque pas de tomber sur une partie d'un mot (exemple: LOGIQUE est une partie de BIOLOGIQUE)
                new_histhangman = new_histhangman + ';' + element; // Le dernier mot ne contient pas de ';'
                // console.log('*** non expire');
            };

            // Liste des mots joués aujourd'hui
            if (uneDateChoisi.valueOf() == aujourdhui.valueOf()) {
                todayHistWordsHangman += unMot + ',';
                // old: todayHistWordsHangman += ';' + unMot + ':';   // ';' et ':' pour garder le même principe de recherche déjà évoqué
            };
        }
    } else {new_histhangman = ';';};
    // console.log('lireHistWordsHangman()=',new_histhangman);
    // console.log('todayHistWordsHangman=',todayHistWordsHangman);
    return new_histhangman;
};


function ajouterMot_a_HistWordsHangman(leMot_a_ajouter) {
    var now = new Date();   // Date où le mot a été joué
    // old: now.setMonth (now.getMonth() + 1 );   // Date d'expiration = 1 mois
    // pour reconstituer la date: new Date(Date.parse(<valeur-date_aaaa-mm-jj>))

    if (histWordsHangman != ';') {
        // Le dernier mot ne contient pas de ';'
        histWordsHangman += ';';
    };
    histWordsHangman += leMot_a_ajouter +':'+ now.toISOString().slice(0,10);   // aaaa-mm-jj
    localStorage.setItem('histhangman_'+laLangue+'_'+niveauJeu, encodeURIComponent(histWordsHangman));
    todayHistWordsHangman += leMot_a_ajouter + ',';
    // console.log("localStorage.getItem('histhangman_"+laLangue+"_"+niveauJeu+"')=",localStorage.getItem('histhangman_'+laLangue+'_'+niveauJeu));
};

// * idea 10/07/2023 with cookies
// function lireHistWordsHangman() {
//     // Lire les mots déjà choisis par l'utilisateur courant
//     allCookies = document.cookie.split(';')
//     for (let i = 0; i < allCookies.length; i++) {
//         nomCookie = allCookies[i].split('=')[0];
//         valCookie = allCookies[i].split('=')[1];
//         if (nomCookie == 'histhangman') {
//             console.log('lireHistWordsHangman()=',valCookie);
//             // Lire la date d'expiration
//             let d_expires;
//             if (i+1 < allCookies.length) {
//                 nomCookie = allCookies[i+1].split('=')[0];
//                 valCookie = allCookies[i+1].split('=')[1];
//                 if (nomCookie.trim() == 'expires') {
//                     d_expires = new Date(Date.parse(decodeURIComponent(valCookie)));
//                 } else {
//                     d_expires = new Date();
//                     d_expires = setMonth( now.getMonth() - 1 );
//                 }
//             } else {
//                     d_expires = new Date();
//                     d_expires = setMonth( now.getMonth() - 1 );
//                 };
//             // Voir si la cookie 'histhangman' a expiré (dans ce cas, on retourne '') ou non
//             if (d_expires < Date()) {return ''}
//             else {
//                 console.log('return=',decodeURIComponent(valCookie));
//                 return decodeURIComponent(valCookie)
//             };
//         }
//     };
//     return '';
// };

// * idea 10/07/2023 with cookies
// function ajouterMot_a_HistWordsHangman(leMot) {
//     console.log('Avant ajout mot-1:',histWordsHangman);
//     console.log('Avant ajout mot-2:',document.cookie);

//     if (histWordsHangman == '') {
//         // Cookie vide ou a expiré
//         var now = new Date();
//         now.setMonth( now.getMonth() + 1 );  // Date d'expiration = 1 mois
//         document.cookie = "histhangman=" + encodeURIComponent(histWordsHangman)+";";
//         document.cookie = "expires=" + encodeURIComponent(now.toDateString()) + ";"        
//     }
//     // Ajouter le mot courant
//     histWordsHangman = histWordsHangman + leMot + ";";
//     document.cookie = "histhangman=" + encodeURIComponent(histWordsHangman);
//     console.log('Apres ajout mot-3:',document.cookie);
// };


// * non utilisée, mais la simplicité est interessante
// function demanderUnMot(laLangue, laDifficulte) {
//     // We use here FETCH and REST-API SYNCHRONOUSLY

//     let url = window.location.origin + '/api/word/' + laLangue + '/' + laDifficulte;
//     // window.location.origin   =>   'http://127.0.0.1:8000'
//     // window.location.host   =>   '127.0.0.1:8000'
//     // window.location.pathname   =>   '/api/word/F/N'

//     const avoirUnMot = async () => {
//         const response = await fetch(url);
//         const json = await response.json();
//         console.log('definition=',json['definition']);
//         console.log('word=',json['word']);
//         console.log('hint=',json['hint']);
//         return json;
//     };

// };


function jouerAvecCeMot (motAJouer) {
    document.getElementById("loading").setAttribute("data","false");
    document.getElementById("definition").innerHTML = motAJouer['definition'];
    leMot[0] = motAJouer['word'];
    leMot[1] = motAJouer['hint'];
    ajouterMot_a_HistWordsHangman(leMot[0]);
    creerEspaceMot();
};

async function demanderUnMot(laLangue, laDifficulte, nbTiragesExistantDans_TodayHist, nbTiragesExistantDans_AllHist) {
    // We use here FETCH and REST-API SYNCHRONOUSLY

    let url = window.location.origin + '/api/word/' + laLangue + '/' + laDifficulte + '/' + todayHistWordsHangman.slice(0,p_MaxLengthOf_todayHistWordsHangman_ToSend);
    // window.location.origin   =>   'http://127.0.0.1:8000'
    // window.location.host   =>   '127.0.0.1:8000'
    // window.location.pathname   =>   '/api/word/F/N'

    // console.log('url=',url);
    
    await fetch(url)
        .then(resp => resp.json())
        .then(function (data) {
            // console.log('def=', data['definition']);
            // console.log('mot ',nbTiragesExistantDans_TodayHist,nbTiragesExistantDans_AllHist,' = ', data["word"]);
            // console.log('hint=', data['hint']);

            // old: if (todayHistWordsHangman.indexOf(';'+data['word']+':') != -1) {   // mot déjà joué aujourd'hui
            if (todayHistWordsHangman.indexOf(','+data['word']+',') != -1) {   // mot déjà joué aujourd'hui
                if (nbTiragesExistantDans_TodayHist < p_MaxNbTimesChecking_NbTiragesExistantDans_TodayHist) {

                    // --- On teste si le mot choisi existe dans la liste des mots joués aujourd'hui; on fait 100 essais au max pour cette liste. Chaque fois qu'il existe (avant les 100 fois), on redemande un autre mot.
                    // --- Sachant qu'une partie (max 300 car., pour ne pas alourdir l'envoi) de la liste des mots joués aujourd'hui est envoyée au serveur pour qu'il évite de choisir un mot parmis eux.
                    // --- Il y a donc double tests, au niveau serveur et au niveau client.

                    // console.log('Existe dans TodayHist');
                    demanderUnMot(laLangue, laDifficulte, ++nbTiragesExistantDans_TodayHist, nbTiragesExistantDans_AllHist)
                } else {
                    // --- Après le max de fois (100), on accèpte le mot choisi.
                    // console.log("echec apres 100 essais dans TodayHist");
                    jouerAvecCeMot(data);
                };
            } else {
                if (histWordsHangman.indexOf(';'+data['word']+':') != -1) {   // mot déjà joué (dans le passé)
                    if (nbTiragesExistantDans_AllHist < p_MaxNbTimesChecking_NbTiragesExistantDans_AllHist) {

                        // --- On teste si le mot choisi existe dans la liste des mots joués (quelque soit le temps qui n'a pas expiré -1 mois-); on fait 10 essais au max pour cette liste. Chaque fois qu'il existe (avant les 10 fois), on redemande un autre mot.                        

                        // console.log('Existe dans AllHist');
                        demanderUnMot(laLangue, laDifficulte, nbTiragesExistantDans_TodayHist, ++nbTiragesExistantDans_AllHist)
                    } else {
                        // --- Après le max de fois (100), on accèpte le mot choisi.
                        // console.log("echec apres 10 essais dans AllHist");
                        jouerAvecCeMot(data);
                    };
                } else {
                    // console.log("success");
                    jouerAvecCeMot(data);
                };
            };
        })
        .catch(erreur => {
            console.log('error=',erreur);
            document.getElementById("loading").setAttribute("data","false");
            if (laLangue == 'F') {
                document.getElementById("definition").innerHTML = '*** Problème avec le serveur ***';
            } else {
                document.getElementById("definition").innerHTML = '*** Problem with the server ***';
            };
            leMot[0] = 'X';
            leMot[1] = 'X';
            document.getElementById("clavier").setAttribute("data", "false");
        });
};


function OLD_demanderUnMot(laLangue, laDifficulte) {
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
            // idea 10/07/2023 with cookies: ajouterMot_a_HistWordsHangman(leMot[0]);

            ajouterMot_a_HistWordsHangman(leMot[0]);
            creerEspaceMot();
            // return true;
        })
        .catch(erreur => {
            if (laLangue == 'F') {
                document.getElementById("definition").innerHTML = '*** Problème avec le serveur ***';
            } else {
                document.getElementById("definition").innerHTML = '*** Problem with the server ***';
            }
            leMot[0] = 'X';
            leMot[1] = 'X';
            document.getElementById("clavier").setAttribute("data", "false");
            // return false;
        });
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

    // old: creerClavier();

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

    histWordsHangman = lireHistWordsHangman()

    // --- Demander un mot
    document.getElementById("loading").setAttribute("data","true");
    demanderUnMot(laLangue, niveauJeu, 0, 0);    // laLangue, laDifficulte, nbTiragesExistantDans_TodayHist, nbTiragesExistantDans_AllHist

    creerClavier();
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