const drumTimings_MS = [
  1,42,68,342,562,571,587,708,786,787,792,927,1124,1170,1291,1365,1599,1022,2017,2190,2244,2408,2430,2472,2486,2631,2640,2696,2728,2762,2923,2983,3126,3293,3335,3552,3830,4024,4088,4114,4148,4153,4333,4377,4415,4490,4537,4563,4631,4632,4710,4958,5015,5065,5105,5117,5164,5170,5320,5363,5435,5517,5590,5595,5686,5692,5793,5828,6051,6095,6161,6369,6603,6676,6727,6741,6870,6928,7090,7120,7320,7367,7410,7439,7464,7486,7567,7635,7752,7754,7829,7917,8015,8041,8043,8072,8112,8114,8120,8168,8297,8333,8344,8406,8467,8542,8597,8644,8754,8885,8944,9003,9117,9218,9407,9445,9516,9645,9698,9746,9920,9963,10255,10393,10436,10503,10564,10577,10588,10651,10698,10778,10779,10819,10906,10974,11007,11049,11073,11201,11335,11339,11412,11569,11580,11642,11735,11785,11790,11887,11990,12022,12160,12230,12302,12427,12609,12639,12708,12864,12911,13024,13133,13139,13277,13342,13368,13461,13557,13643,13715,13774,13865,13975,14027,14053,14174,14272,14427,14474,14552,14580,14636,14714,14812,14992,15008,15128,15130,15230,15239,15379,15437,15492,15578,15596,15667,15786,15977,16011,16394,16432,16463,16502,16542,16656,16677,16698,16766,16883,16924,17021,17110,17164,17212,17320,17497,17512,17547,17697,17754,17871,17887,17897,17987,18099,18165,18186,18290,18336,18519,18567,18690,18723,18801,18821,18871,18909,18946,19079,19119,19166,19411,19458,19460,19641,19658,19701,19728,19865,19919,20045,20055,20174,20309,20363,20386,20387,20507,20559,20609,20674,20736,20784,20877,20921,20945,21115,21279,21342,21380,21567,21580,21632,21747,21771,21934,21957,22120,22234,22279,22292,22342,22465,22485,22561,22715,22719,22724,22022,22823,22912,22997,23127,23238,23291,23334,23397,23440,23452,23609,23712,23762,23805,23833,23859,24005,24032,24159,24217,24435,24478,24510,24642,24799,24819,24861,24937,25038,25044,25149,25290,25317,25320,25404,25457,25579,25621,25682,25807,25897,25947,26089,26153,26194,26199,26249,26295,26296,26367,26403,26444,26489,26532,26552,26689,26844,26892,26949,27023,27092,27294,27338,27371,27505,27521,27568,27581,27714,27766,27867,27941,28017,28093,28102,28319,28392,28520,28561,28595,28664,28735,28778,28804,28947,28957,29014,29107,29149,29233,29355,29376,29479,29526,29530,29599,29690,29818,29830,29891,29996,30051,30167,30198,30336,30402,30508,30524,30613,30655,30845,31017,31032,31049,31129,31284,31286,31450,31509,31519,31521,31570,31687,31784,31959,32037,32090,32140,32203,32232,32279,32340,32432,32580,32634,32652,32787,32792,32834,32855,32975,32995,33037,33059,33086,33097,33270,33477,33529,33602,33615,33680,33722,33743,33756,33877,33984,34052,34067,34114,34223,34285,34317,34399,34470,34486,34619,34622,34702,34776,34859,34865,34914,34924,34956,34999,35092,35312,35334,35382,35546,35699,35896,36066,36117,36172,36206,36279,36489,36584,36780,36802,36852,36931,37044,37194,37241,37490,37507,37529,37696,37774,37784,37866,37966,38334,38347,38399,38548,38610,38629,38784,38838,38886,38946,39001,39186,39356,39479,39506,39507,39621,39779,39868,39986,40026,40041,40003,40110,40246,40254,40293,40351,40458,40508,40602,40614,40686,40756,40840,40876,40972,41012,41106,41147,41299,41318,41338,41464,41516,41619,41687,41861,42100,42174,42209,42273,42328,42363,42402,42443,42456,42684,42867,42969,43031,43096,43131,43173,43253,43263,43289,43338,43396,43424,43533,43596,43666,43728,43010,43897,43974,44033,44128,44221,44278,44302,44317,44356,44418,44481,44585,44742,44761,44914,44974,44999,45051,45161,45218,45268,45316,45413,45460,45507,45509,45626,45704,45741,45794,45961,46061,46063,46156,46303,46366,46594,46609,46731,46799,46836,47023,47220,47259,47277,47418,47422,47524,47586,47662,47682,47839,47886,47965,48022,48039,48174,48371,48373,48431,48515,48557,48605,48616,48653,48686,48735,48783,48795,48849,48896,48988,49035,49160,49222,49270,49403,49547,49576,49590,49727,49802,49832,49922,50005,50062,50110,50132,50343,50370,50428,50460,50595,50605,50658,50867,50973,51075,51117,51176,51323,51347,51382,51453,51557,51690,51722,51770,51907,51908,52013,52185,52198,52252,52312,52491,52698,52777,52955,52963,52983,53197,53357,53386,53440,53565,53743,53778,53899,53970,54150,54321,54370,54537,54539,54680,54734,54848,54948,54967,55145,55222,55293,55364,55572,55647,55744,55940,55989,56194,56380,56440,56562,56617,56675,56795,56835,56860,56921,56984,57006,57120,57166,57389,57499,57552,57649,57707,57867,57937,58209,58397,58484,58503,58613,58748,58757,58932,59290,59330,59371,59477,59503,59680,59713,59854,59932,60089,60188,60236,60455,60582,60668,60669,60839,60873,60877,61024,61097,61189,61274,61297,61338,61358,61461,61549,61617,61736,61807,61810,61867,61914,61981,62033,62035,62172,62227,62277,62322,62369,62497,62544,62553,62714,62917,63099,63137,63146,63404,63555,63572,63689,63824,63872,63907,63986,64146,64172,64177,64232,64338,64471,64519,64714,64887,64927,64935,65064,65111,65149,65227,65274,65400,65549,65646,65695,65805,65936,65938,66014,66184,66222,66227,66389,66472,66480,66629,66709,66807,66946,67082,67152,67199,67258,67299,67407,67449,67485,67634,67704,67855,67881,67902,68094,68144,68222,68287,68461,68541,68608,68621,68622,68724,68882,68898,68922,68932,69009,69054,69281,69282,69486,69489,69495,69692,69706,69780,69831,69911,69959,70086,70105,70252,70359,70535,70555,70607,70716,70780,70844,70914,71071,71087,71116,71224,71305,71329,71414,71639,71677,71704,71778,71809,71869,71891,72099,72296,72477,72577,72613,72662,72681,72782,72832,72889,72902,72967,73019,73206,73299,73436,73570,73596,73599,73777,73821,73849,73979,73999,74187,74254,74506,74546,74554,74719,74936,74959,75005,75027,75081,75127,75302,75309,75444,75456,75497,75548,75661,75741,75769,75893,75926,75971,76047,76129,76174,76287,76371,76381,76499,76594,76697,76767,76779,76831,76904,76926,76944,76984,77006,77025,77196,77208,77222,77261,77448,77484,77531,77659,77709,77781,77828,77959,78039,78158,78346,78389,78461,78499,78579,78638,78691,78751,78951,78998,79101,79115,79231,79278,79326,79414,79476,79572,79601,79736,79800,79806,79822,79858,79906,80068,80176,80223,80272,80358,80406,80486,80533,80612,80721,80768,80780,80816,80871,80929,81041,81093,81181,81241,81298,81406,81465,81491,81573,81646,81680,81771,81904,81915,81968,82122,82234,82293,82309,82396,82493,82569,82730,82794,83006,83041,83242,83260,83305,83368,83497,83683,83877,84051,84289,84384,84412,84468,84577,84644,84691,84829,84894,84948,85010,85081,85152,85286,85354,85502,85669,85806,85822,85946,86091,86201,86370,86797,86989,87407,87869,88114,88218,88311,88463,88532,88698,88729,88888,88919,88959,89131,89140,89190,89436,89471,89670,89826,89851,89983,90066,90074,90314,90333,90532,90566,90699,90791,90901,91131,91367,91557,91759,91951,92006,92076,92164,92185,92253,92406,92546,92751,92784,92898,93021,93056,93343,93436,93503,93644,93668,93831,93983,94017,94113,94185,94259,94318,94320,94365,94485,94494,94555,94773,94843,94913,95043,95217,95271,95295,95353,95617,95642,95975,96087,96179,96233,96385,96429,96445,96570,96629,96640,96792,97067,97240,97259,97414,97595,97642,97657,97720,97778,97980,98039,98119,98148,98155,98312,98350,98359,98482,98627,98782,98837,99012,99055,99111,99130,99329,99599,99638,99725,99730,99859,99909,99940,100010,100057,100125,100227,100292,100322,100547,100652,100702,100822,100873,100889,100975,100977,101049,101225,101234,101324,101371,101432,101561,101608,101728,101792,101848,101902,101930,101952,101967,102017,102230,102247,102420,102480,102547,102599,102648,102669,102735,102792,102924,102978,103065,103127,103224,103490,103498,103632,103759,103809,103856,103963,104024,104157,104230,104310,104442,104642,104765,104980,105015,105200,105409,105465,105547,105620,105789,105842,106305,106387,106454,106555,106680,106715,106922,107057,107304,107457,107550,107612,107765,107784,108052,108102,108355,108477,108598,108627,108682,108730,108799,108819,109004,109065,109157,109259,109306,109328,109354,109574,109689,109824,109877,109902,109974,110091,110144,110284,110292,110336,110477,110584,110745,110813,110845,110952,111116,111195,111222,111232,111269,111379,111442,111486,111554,111599,111660,111717,111774,111809,111940,111941,111942,112099,112121,112227,112289,112394,112451,112539,112549,112609,112629,112729,112782,112881,112931,112954,113154,113441,113543,113586,113628,113639,113692,113746,113817,114013,114099,114152,114202,114246,114298,114394,114471,114487,114543,114667,114701,114806,114847,114873,114921,114979,114995,115018,115131,115165,115198,115329,115349,115365,115423,115473,115592,115654,115779,115784,115896,116071,116087,116093,116131,116257,116280,116332,116448,116624,116796,116980,117074,117220,117229,117301,117379,117405,117473,117558,117634,117647,117703,117816,117932,117964,118019,118172,118281,118369,118533,118562,118604,118634,118647,118735,118855,118859,119020,119107,119204,119325,119333,119340,119418,119569,119597,119610,119749,119837,119999,120156,120162,120226,120255,120352,120404,120552,120727,120801,120842,120989,121002,121003,121048,121139,121371,121578,121628,121694,121704,121746,121836,121911,121920,121946,121993,122097,122199,122382,122536,122644,122678,122682,122720,122841,122888,123117,123145,123239,123334,123421,123505,123516,123542,123683,123886,124033,124176,124270,124299,124360,124506,124554,124558,124595,124657,124686,124891,125029,125143,125236,125273,125321,125337,125519,125556,125598,125683,125768,125913,126011,126046,126055,126093,126141,126164,126203,126254,126369,126391,126443,126561,126619,126666,126686,126733,126780,126929,126978,127016,127033,127057,127066,127099,127116,127284,127366,127413,127569,127618,127665,127753,127971,127992,128027,128169,128188,128315,128322,128408,128468,128529,128559,128616,128759,128863,129073,129179,129191,129195,129264,129268,129316,129407,129476,129645,129668,129689,129796,129921,129924,129998,130127,130235,130283,130354,130382,130413,130564,130591,130703,130751,130756,130841,130848,130910,130920,130983,131064,131134,131137,131236,131277,131303,131379,131484,131513,131560,131608,131696,131729,131821,131989,132071,132111,132192,132311,132383,132433,132506,132541,132572,132704,132764,132964,132984,133036,133095,133221,133234,133360,133446,133496,133553,133601,133703,133751,133842,133860,133938,133994,134027,134039,134198,134242,134263,134428,134475,134509,134528,134584,134703,134742,134763,134831,134888,134943,134990,135079,135144,135191,135229,135276,135355,135406,135407,135468,135476,135523,135715,135729,135752,135776,135826,135961,135982,136036,136129,136166,136176,136202,136354,136401,136428,136476,136510,136522,136544,136772,136781,136785,136844,136926,136989,137006,137120,137197,137260,137408,137439,137578,137591,137626,137661,137672,137803,137910,137940,137989,138051,138113,138183,138185,138188,138214,138235,138408,138616,138668,138701,138713,138760,138807,138891,138912,138945,139086,139091,139138,139190,139231,139286,139329,139521,139571,139700,139723,139805,139829,139890,139935,140065,140090,140126,140137,140260,140330,140369,140377,140520,140605,140649,140783,140969,141031,141065,141097,141138,141164,141596,141746,141812,141850,141852,141873,141921,142118,142166,142258,142326,142384,142459,142464,142571,142623,142646,142716,142846,142863,142898,143000,143216,143267,143283,143336,143429,143491,143541,143668,143706,143763,144039,144040,144082,144138,144208,144273,144441,144443,144488,144501,144529,144623,144719,144727,144816,144923,144980,145016,145160,145223,145276,145278,145310,145322,145398,145511,145531,145585,145633,145645,145710,145783,145814,145891,145951,146001,146061,146070,146248,146281,146315,146332,146407,146481,146488,146528,146576,146622,146670,146695,146699,146968,147018,147068,147104,147115,147153,147323,147381,147425,147483,147564,147583,147605,147653,147705,147789,147798,147821,147900,147978,148033,148081,148172,148223,148391,148515,148562,148610,148644,148673,148676,148758,148826,148875,148919,149003,149092,149156,149235,149340,149376,149421,149456,149507,149555,149635,149686,149688,149695,149790,149838,149845,149985,150032,150101,150326,150380,150545,150651,150702,150711,150744,150768,150803,151003,151033,151084,151108,151162,151203,151266,151326,151515,151536,151622,151680,151727,151812,151823,151827,151877,151965,151983,152035,152228,152232,152429,152438,152492,152573,152595,152677,152729,152841,152889,152993,153058,153071,153266,153286,153343,153389,153441,153513,153548,153694,153729,153916,153924,153966,154142,154158,154171,154180,154355,154398,154411,154547,154618,154653,154759,154804,154834,154953,155029,155043,155071,155168,155271,155363,155368,155438,155454,155508,155512,155517,155572,155688,155735,155800,155918,156000,156073,156125,156145,156168,156390,156442,156448,156471,156500,156620,156663,156820,156966,157013,157026,157238,157308,157311,157606,157643,157645,157830,157901,157910,158010,158068,158232,158285,158420,158479,158480,158495,158670,158691,158725,158844,158993,159106,159168,159224,159233,159390,159418,159473,159633,159672,159838,159883,159886,159985,160050,160153,160226,160320,160376,160505,160555,160573,160653,160716,160854,160857,160945,161033,161094,161143,161182,161305,161353,161454,161573,161642,161782,161829,161863,161895,162030,162077,162123,162172,162220,162297,162352,162410,162443,162497,162767,162830,162959,163053,163055,163198,163266,163280,163668,163910,163940,164156,164205,164252,164292,164347,164387,164419,164619,164640,164670,164805,164842,164890,164941,165017,165018,165174,165220,165222,165331,165488,165514,165699,165718,165865,165933,166061,166116,166147,166247,166332,166482,166605,166658,166783,166874,166968,167127,167215,167309,167351,167447,167457,167622,167844,167910,167982,168034,168113,168228,168268,168296,168340,168414,168507,168535,168659,168701,168770,168870,168965,169021,169111,169122,169170,169210,169390,169485,169543,169561,169564,169611,169622,169785,169870,169946,169996,169998,170042,170095,170110,170152,170197,170291,170333,170339,170343,170437,170483,170552,170568,170660,170717,170756,170796,170815,170818,170836,170867,171030,171067,171124,171180,171230,171295,171316,171317,171419,171474,171517,171518,171685,171748,171749,171861,171904,171976,172022,172064,172110,172206,172223,172224,172298,172359,172529,172576,172639,172681,172771,172823,172827,172894,173126,173145,173168,173210,173357,173384,173403,173612,173693,173734,173778,173845,173854,173887,174039,174101,174119,174242,174320,174351,174403,174444,174464,174485,174628,174669,174702,174857,174906,174925,175058,175129,175316,175347,175373,175450,175569,175570,175793,175874,176012,176017,176032,176211,176218,176226,176290,176433,176478,176570,176572,176733,176781,176798,176820,176970,177030,177036,177192,177208,177242,177260,177470,177520,177522,177590,177713,177748,177755,177792,178006,178010,178037,178072,178138,178180,178252,178349,178410,178483,178505,178616,178671,178690,178709,178738,178795,178858,178861,178928,178995,179037,179121,179182,179355,179407,179603,179609,179650,179735,179854,180040,180053,180076,180133,180260,180277,180435,180476,180584,180631,180654,180715,180765,180840,180871,180891,180995,181107,181180,181343,181384,181471,181513,181632,181770,181782,181839,181860,181900,181977,182028,182166,182305,182347,182364,182374,182389,182510,182553,182601
];
