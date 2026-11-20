'use strict';
const $=s=>document.querySelector(s);
const video=$('#v'),cv=$('#cv'),ctx=cv.getContext('2d',{alpha:false,desynchronized:true}),hist=$('#hist').getContext('2d');
const AW=128;let AH=90;
const an=document.createElement('canvas'),actx=an.getContext('2d',{willReadFrequently:true});
const pk=document.createElement('canvas'),pkx=pk.getContext('2d');
const S={facing:'environment',stab:true,peak:false,fmt:'jpg',focus:'continuous'};
const FMTS=['jpg','png','raw'];
let stream=null,track=null,caps={};
let prev=new Uint8Array(0),cur=new Uint8Array(0),hasPrev=false,pkImg=null;
const D={x:0,y:0},SM={x:0,y:0};let off={x:0,y:0};
const MARGIN=0.05;let sharp=0,frameN=0,busy=false;

function toast(m,t=2200){const e=$('#toast');e.textContent=m;e.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>e.classList.remove('on'),t)}
const adv={},RES={w:1280,h:720};
const buildC=()=>({width:{ideal:RES.w},height:{ideal:RES.h},advanced:[{...adv}]});
async function apply(c){
  Object.assign(adv,c);
  try{await track.applyConstraints(buildC());delete adv.pointsOfInterest;return true}
  catch(e){Object.keys(c).forEach(k=>delete adv[k]);toast('Réglage non pris en charge');return false}
}
async function setRes(w,h){RES.w=w;RES.h=h;try{await track.applyConstraints(buildC());return true}catch(e){return false}}
async function hiRes(){
  const mw=caps.width&&caps.width.max,mh=caps.height&&caps.height.max;
  if(!mw||video.videoWidth>=mw)return false;
