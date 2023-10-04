class Unit {
		
    constructor (attack,defense,health,min_damage,max_damage,nomer,tip_unit) {
		this.nomer=nomer;
		this.attack = attack;
		this.defense = defense;
		this.health = health; 
		this.min_damage = min_damage;
		this.max_damage = max_damage;
		this.tip_unit = tip_unit;
		
    }
	
	obnovlenie_health() {
		$('#'+this.tip_unit+'-'+this.nomer).val(this.nomer+'-'+this.health);
	}
	
}

class Monstr extends Unit {
    constructor(attack,defense,health,min_damage,max_damage,nomer,tip_unit) {
        super(attack,defense,health,min_damage,max_damage,nomer,tip_unit);
    }
}

class Player extends Unit {

    constructor(attack,defense,health,min_damage,max_damage,nomer,tip_unit) {
        super(attack,defense,health,min_damage,max_damage,nomer,tip_unit);
		this.max_health = this.health;
		this.kolvo_lechenie = 4;
    }
	
	lechenie() {
		if(this.kolvo_lechenie>0){
			var value_lechenie=Math.round(this.max_health*0.3);
			if( (value_lechenie+this.health)>this.max_health ){
				this.health=this.max_health;
			}else{
				this.health=value_lechenie+this.health;
			}
			this.kolvo_lechenie--;
			this.obnovlenie_health();
			if (this.kolvo_lechenie==0){
				$('#'+this.tip_unit+'-'+this.nomer+'-lechenie').remove();
			}
		}
	}

}

nomer_monstr=0;
nomer_player=0;
monstr=[];
player=[];
activ_attack=["",""];

function CreateUnit(){
	error=0;
	attack=Number($('input[name="attack"]').val());
	if (Number.isInteger(attack)==false || attack<1 || attack>30){ alert("Pole ataki vvedeno ne verno"); error=1; }
	
	defense=Number($('input[name="defense"]').val());
	if (Number.isInteger(defense)==false || defense<1 || defense>30){ alert("Pole zahiti vvedeno ne verno"); error=1; }
	
	health=Number($('input[name="health"]').val());
	if (Number.isInteger(health)==false || health<1){ alert("Pole jizni vvedeno ne verno"); error=1; }
	
	min_damage=Number($('input[name="min_damage"]').val());
	if (Number.isInteger(min_damage)==false || min_damage<1){ alert("Pole min damage vvedeno ne verno"); error=1; }
	
	max_damage=Number($('input[name="max_damage"]').val());
	if (Number.isInteger(max_damage)==false || max_damage<1 || max_damage<min_damage){ alert("Pole max damage vvedeno ne verno"); error=1; }

	tip_unit=$('input[name="tip_unit"]:checked').val();
	if (tip_unit!="Monstr" && tip_unit!="Player"){ alert("Pole tip unita vvedeno ne verno"); error=1; }

	if(error!=1){
		if(tip_unit=="Monstr"){
			nomer_monstr++;
			monstr[nomer_monstr]=new Monstr(attack, defense, health, min_damage, max_damage, nomer_monstr, tip_unit);
			nomer=nomer_monstr;
			lechenie="</p>";
		}else if (tip_unit=="Player"){
			nomer_player++;
			player[nomer_player]=new Player(attack, defense, health, min_damage, max_damage, nomer_player, tip_unit);
			nomer=nomer_player;
			lechenie='<input type="button" id="'+tip_unit+'-'+nomer_player+'-lechenie" value="+" onClick=player['+nomer_player+'].lechenie(); /></p>';
		}
		$("#"+tip_unit).append('<p id="'+tip_unit+'--'+nomer+'"><input type="button" id="'+tip_unit+'-'+nomer+'" value="'+nomer+'-'+health+'" onClick=Attack("'+nomer+'","'+tip_unit+'"); />'+lechenie);
	}
	
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); 
}

function Attack(nomer,tip_unit){
	if (activ_attack[1]==""){
		activ_attack[0]=nomer;
		activ_attack[1]=tip_unit;
		$('#'+tip_unit+'-'+nomer).css("background-color", "red");
	}else if(activ_attack[0]==nomer && activ_attack[1]==tip_unit){
		activ_attack[0]="";
		activ_attack[1]="";
		$('#'+tip_unit+'-'+nomer).css("background-color", "");
	}else if(activ_attack[0]!=nomer && activ_attack[1]==tip_unit){
		$('#'+tip_unit+'-'+activ_attack[0]).css("background-color", "");
		$('#'+tip_unit+'-'+nomer).css("background-color", "red");
		activ_attack[0]=nomer;
	}else{
		if(activ_attack[1]=="Player"){ataker=player[activ_attack[0]]; defer=monstr[nomer];}
		else if(activ_attack[1]=="Monstr"){ataker=monstr[activ_attack[0]]; defer=player[nomer];}
		
		mod_attack=ataker.attack-defer.defense+1;
		if(mod_attack<1){mod_attack=1;}
		
		uspex_attack=0;
		for ( i = 1; i <= mod_attack; i++) {
			rand=getRandomIntInclusive(1,6);
			if(rand==5 || rand==6){uspex_attack=1;}
		}
		
		if(uspex_attack==1){
			defer.health=defer.health-getRandomIntInclusive(ataker.min_damage,ataker.max_damage);
			defer.obnovlenie_health();
			if(defer.health<=0){
				if (tip_unit=="Player"){delete player[nomer];}
				else if (tip_unit=="Monstr"){delete monstr[nomer];}
				$('#'+tip_unit+'--'+nomer).remove();
			}
		}
		
	}
}

