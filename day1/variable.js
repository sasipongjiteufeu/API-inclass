var x = 10; // มันเป็น globle ตัวแปร globle ไม่ว่าจะกล่าวกี่ครั้งก็จะเป็นตัวนี้ ไม่ว่าจะกล่าวบรรทัดไหนก็ตาม **ไม่นิยม
const y = 20; //const แปลว่า "ค่าคงที่" ไม่สามารถเปลี่ยนค่าหรือแก้ไขได้ 
let z = 15; // ตรงข้ามกับ const 

console.log(x,y,z) //console.log คือ print ออก terminal

y = 8; // มันจะ error เพราะไปเปลี่ยนค่าของ const

console.log(x,y,z)
