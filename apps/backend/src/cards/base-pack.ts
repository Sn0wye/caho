export type CardPack = {
  id: string;
  name: string;
  official: boolean;
  cards: Cards;
};

export type Cards = {
  white: WhiteCard[];
  black: BlackCard[];
};

export type WhiteCard = {
  id: string;
  text: string;
  packId: string;
};

export type BlackCard = {
  id: string;
  text: string;
  pick: number;
  packId: string;
};

export const basePack: CardPack = {
  id: 'base-pack',
  name: 'Pacote padrão',
  official: true,
  cards: {
    white: [
      { text: 'Tweetar.', packId: 'base-pack', id: 'v7l9qvk59jlp0wi1dpasrk0w' },
      {
        text: '(Estou fazendo exercícios de pompoarismo agora.)',
        packId: 'base-pack',
        id: 'boxaa302brhx1ttpxthfhwcu'
      },
      {
        text: '10.000 refugiados sírios.',
        packId: 'base-pack',
        id: 'qredgojuc8i6jzwke4rqz86t'
      },
      {
        text: '2 Girls 1 Cup.',
        packId: 'base-pack',
        id: 'b1ebmwniohluyfvybtpe8xdc'
      },
      {
        text: '400 anos de atrocidades coloniais.',
        packId: 'base-pack',
        id: 'chkecpmtn90m9po7faplm285'
      },
      {
        text: '50 mg de Viagra diariamente.',
        packId: 'base-pack',
        id: 'opas17fv9pm7tzdgqf8ek1wu'
      },
      {
        text: '50.000 volts diretamente nos mamilos.',
        packId: 'base-pack',
        id: 'ba01wai3ac2ecl44vd7c9ym7'
      },
      {
        text: '72 virgens.',
        packId: 'base-pack',
        id: 'g0derhnafrp4mbch8vjdrzh3'
      },
      {
        text: '200 gramas de doce heroína mexicana.',
        packId: 'base-pack',
        id: 'xfn4bm2gxo8omefkew6xfvot'
      },
      {
        text: 'Um saco de feijões mágicos.',
        packId: 'base-pack',
        id: 'khuby12ntmz7zm28f934z02b'
      },
      {
        text: 'Um café da manhã equilibrado.',
        packId: 'base-pack',
        id: 'ewbalsfihcmfa83w2kjtbioj'
      },
      {
        text: 'Uma grande pica negra.',
        packId: 'base-pack',
        id: 'nc45ba6s4tciwzp8trmb2pb4'
      },
      {
        text: 'Uma grande confusão por nada.',
        packId: 'base-pack',
        id: 'xn0hbhu6l2xw1xte0vvzif6i'
      },
      {
        text: 'Um pássaro que caga fezes humanas.',
        packId: 'base-pack',
        id: 'b3lzvsed4g3vmkxyx8phn0an'
      },
      {
        text: 'Um pouco de carinho e cócegas.',
        packId: 'base-pack',
        id: 'wdriu9ipkx40qt2oo4p5mufn'
      },
      {
        text: 'Uma porrada.',
        packId: 'base-pack',
        id: 'ny53u4jgerkfdrkfeb1vgspt'
      },
      {
        text: 'Um cu rosinha.',
        packId: 'base-pack',
        id: 'b87h66v89b8edyata3fifie2'
      },
      {
        text: 'Um cu branquinho.',
        packId: 'base-pack',
        id: 'azg5kvbbqg2dxnjuo26i0dl6'
      },
      {
        text: 'Uma tigela de maionese.',
        packId: 'base-pack',
        id: 'cmgbcbp4hlkgjashk87yiaj4'
      },
      {
        text: 'Um tumor cerebral.',
        packId: 'base-pack',
        id: 's9ogmut798m34jwv1bzpjp4o'
      },
      {
        text: 'Um balde de cabeças de peixe.',
        packId: 'base-pack',
        id: 'm6bw8ipr400br2bd8wq24kj5'
      },
      {
        text: 'Uma lata de porra.',
        packId: 'base-pack',
        id: 'ajsrc6qdaxgm1ous255lt49f'
      },
      {
        text: 'Uma carícia na coxa.',
        packId: 'base-pack',
        id: 'p2wns7uib6zms00vuxawsfag'
      },
      {
        text: 'Uma mão no volante, outra no carinho.',
        packId: 'base-pack',
        id: 'p2wns7uib6zms00vuxawsfag'
      },
      {
        text: 'Um camelo de desenho animado apreciando o suave e refrescante sabor de um cigarro.',
        packId: 'base-pack',
        id: 'xgvnngsmggz9p6pliigwxkql'
      },
      {
        text: 'Um gato com mãos.',
        packId: 'base-pack',
        id: 'm0pmoss5r2i8qxx0gsfo5ii2'
      },
      {
        text: 'Um banco de uma cervejaria.',
        packId: 'base-pack',
        id: 'm9ap4tgfg3mjq5mnscyg5313'
      },
      {
        text: 'Um turista chinês que quer muito algo, mas não consegue se comunicar.',
        packId: 'base-pack',
        id: 'xb4aavat11axqdfxthzkso1n'
      },
      {
        text: 'Uma coçada discreta no brioco.',
        packId: 'base-pack',
        id: 'kejpaxzzhtqg3ruqzpzwrz73'
      },
      {
        text: 'Uma caixa cheia de órgãos.',
        packId: 'base-pack',
        id: 'n3h3fzb29e4o6zpylnw9smdq'
      },
      {
        text: 'Uma cópia do Manifesto do Partido Comunista.',
        packId: 'base-pack',
        id: 'uhnk9gp0diusg93lf58s08hy'
      },
      {
        text: 'Uma cópia do Manifesto do Partido Comunista.',
        packId: 'base-pack',
        id: 'uhnk9gp0diusg93lf58s08hy'
      },
      {
        text: 'Uma cópia do Mein Kampf.',
        packId: 'base-pack',
        id: 'uhnk9gp0diusg93lf58s08hy'
      },
      {
        text: 'Uma crucificação.',
        packId: 'base-pack',
        id: 'vs4dizdggswkzn90qv10cbbz'
      },
      {
        text: 'Um coala fofo e peludo, mas que tem clamídia.',
        packId: 'base-pack',
        id: 'zitufv5f0epx4nz2hku5ope2'
      },
      {
        text: 'Um raio da morte.',
        packId: 'base-pack',
        id: 'l1eingsvf93lwk4kvllqbg8s'
      },
      {
        text: 'Uma conexão de Internet que presta.',
        packId: 'base-pack',
        id: 'fgen4d17i01lgw4wzj40awi8'
      },
      {
        text: 'Um preservativo furado.',
        packId: 'base-pack',
        id: 's17h7sz7i39s2wpan3uz20r8'
      },
      {
        text: 'Um fã dos Mamonas Assassinas sentado sozinho.',
        packId: 'base-pack',
        id: 'v4sfojvfkwnncxk5bxv267s0'
      },
      {
        text: 'Um pênis de borracha.',
        packId: 'base-pack',
        id: 'b6igw3eqb856fcu5tlra239h'
      },
      {
        text: 'Uma festa de aniversário decepcionante.',
        packId: 'base-pack',
        id: 'et9ce2yjqudur6cuy77bhsgu'
      },
      {
        text: 'Um tiroteio de carro.',
        packId: 'base-pack',
        id: 'h8s59w9sxt27djt8bw3xhq7z'
      },
      {
        text: 'Um jogo de terror.',
        packId: 'base-pack',
        id: 'b8l13lcybpdfsdigucfbx592'
      },
      {
        text: 'Uma capivara de boné.',
        packId: 'base-pack',
        id: 'g0dz7hmtj2fbpvsz1dcfj8gt'
      },
      {
        text: 'Um peido vaginal.',
        packId: 'base-pack',
        id: 'yz89c6roaubkpqavj3aj0lay'
      },
      {
        text: 'Um velho gordo e careca da internet.',
        packId: 'base-pack',
        id: 'znb0fqppn7x4e1bde2wmam17'
      },
      {
        text: 'Um velho da internet.',
        packId: 'base-pack',
        id: 'znb0fqppn7x4e1bde2wmam17'
      },
      { text: 'Um feto.', packId: 'base-pack', id: 'j4nwzawv9by1trsj3uggyrku' },
      {
        text: 'Uma garrafa de vinho barato.',
        packId: 'base-pack',
        id: 'sysvdisz7m5xnoecdkawg3by'
      },
      {
        text: 'Uma boneca sexual.',
        packId: 'base-pack',
        id: 'gfpd2gn19hgjvpzlov830420'
      },
      {
        text: 'Rogério Skylab.',
        packId: 'base-pack',
        id: 'erb0l7ka53w512pv3y2m4vhb'
      },
      {
        text: 'Uma boca suja.',
        packId: 'base-pack',
        id: 'tezv8fw92p1zd7zd7mr6xt6e'
      },
      {
        text: 'Um monte de merda.',
        packId: 'base-pack',
        id: 'mh6pp79ebvdxm7qhvxcz17cr'
      },
      {
        text: 'Um bom cheirinho.',
        packId: 'base-pack',
        id: 'nm46x2xxhjkiaz5p4vw97lhg'
      },
      {
        text: 'Um gorila forte e poderoso.',
        packId: 'base-pack',
        id: 'b716i4lgw0v0zs5i5dpg5t74'
      },
      {
        text: 'Um café gelado sem açúcar.',
        packId: 'base-pack',
        id: 'rymbm5o56x0ktntaxjn0luye'
      },
      {
        text: 'Uma maldição cigana.',
        packId: 'base-pack',
        id: 'njr20hqr705i6l55ib96l2xu'
      },
      {
        text: 'Um pequeno saco de merda sem pelos chamado Pigmeu.',
        packId: 'base-pack',
        id: 'drhvgp0bvs5cdtd6ng6wylsh'
      },
      {
        text: 'Um pacote de lanche Halal.',
        packId: 'base-pack',
        id: 'qxmpwwv6lfesrg2xtg79jr9s'
      },
      {
        text: 'Uma noite de despedida de solteira em Pelotas.',
        packId: 'base-pack',
        id: 'gb1pypdz82le6yf2hya1sun1'
      },
      {
        text: 'Um exame de próstata.',
        packId: 'base-pack',
        id: 'ml5yhs9j4h6a0f2csk3n0l1f'
      },
      {
        text: 'Uma horda de viados.',
        packId: 'base-pack',
        id: 'b157r6wrtzmxqgx02iblxxkr'
      },
      {
        text: 'Uma tremenda bagunça.',
        packId: 'base-pack',
        id: 'w2fpvzjt2rgzuu8g3p4drw85'
      },
      {
        text: 'Um turista japonês que quer muito algo, mas não consegue comunicar.',
        packId: 'base-pack',
        id: 'brft4zkdy4nrlc5j3c86f7su'
      },
      {
        text: 'Uma operação de caça às baleias japonesas.',
        packId: 'base-pack',
        id: 'r6ssu5ganorh2fnxhyj5qfaa'
      },
      {
        text: 'Uma festa do MC LAN.',
        packId: 'base-pack',
        id: 'bd38cutfiij0y6fycatvzzdt'
      },
      {
        text: 'Uma vida inteira de tristeza.',
        packId: 'base-pack',
        id: 'bi09dzck53r5e8yge1fokh3g'
      },
      {
        text: 'Um tornado de fogo.',
        packId: 'base-pack',
        id: 'foohnj8o9vuu5v206fzza48q'
      },
      {
        text: 'Um garotinho que não para de falar sobre dinossauros.',
        packId: 'base-pack',
        id: 'g7n71olzqg7nnqvuaanhjti1'
      },
      {
        text: 'Uma plateia.',
        packId: 'base-pack',
        id: 'a24wr8msmwqcrwzqja1ai5i5'
      },
      {
        text: 'Aquela olhadinha.',
        packId: 'base-pack',
        id: 'ag97gdv5yonk5a9lo30hrwm8'
      },
      {
        text: 'Um padrão de vida baixo.',
        packId: 'base-pack',
        id: 'oyql7w09m09j5unzqe853q5y'
      },
      {
        text: 'Uma vaca louca.',
        packId: 'base-pack',
        id: 'ym37u91g52wbdwxkcilskhus'
      },
      {
        text: 'Um homem louco que vive em uma cabine telefônica e sequestra mulheres.',
        packId: 'base-pack',
        id: 'nhxkp3ottqa4qdsejop38a18'
      },
      {
        text: 'Aquela coisa.',
        packId: 'base-pack',
        id: 'c6m3r9a4q24josbtb48utnt2'
      },
      {
        text: 'Um homem quase gozando.',
        packId: 'base-pack',
        id: 'ux4xx720m6qm8nxjnwua790x'
      },
      {
        text: 'Um ritual de acasalamento.',
        packId: 'base-pack',
        id: 'lwdpaajmuhq1w0q0ae8p3t6u'
      },
      {
        text: 'Um mexicano.',
        packId: 'base-pack',
        id: 'gslhiexdvrqk5mr0v30gt6xr'
      },
      {
        text: 'Um micro-pênis.',
        packId: 'base-pack',
        id: 'hvs102rhn0va918sxgrnc7qf'
      },
      {
        text: 'Um porco usando uma capa de chuva e botinhas.',
        packId: 'base-pack',
        id: 'qft2cdpdgjd6uppcyfmgksia'
      },
      {
        text: 'Um homem de meia-idade de patins.',
        packId: 'base-pack',
        id: 'zyi3ld000sq3mhvx02wdyu53'
      },
      {
        text: 'Um mímico tendo um derrame.',
        packId: 'base-pack',
        id: 'ydj8ygb7lwzyojgi0jkcy85k'
      },
      {
        text: 'Um momento de silêncio.',
        packId: 'base-pack',
        id: 'sv3zmitjtprzg5q0q4evfob8'
      },
      {
        text: 'Um macaco fumando charuto.',
        packId: 'base-pack',
        id: 'rkll5ysrtiuwihfuiognzfo0'
      },
      {
        text: 'Um leão de zoológico triste e desanimado.',
        packId: 'base-pack',
        id: 'yt62wi7ik6ovvdd9ntetrol9'
      },
      {
        text: 'Uma mulher bem mais jovem.',
        packId: 'base-pack',
        id: 'lms31hlon6lxjfuaiey0gb1o'
      },
      {
        text: 'Um assassinato terrível.',
        packId: 'base-pack',
        id: 'ierk5ezq3lua19opyadaq9i1'
      },
      {
        text: 'Um Tamagotchi™ negligenciado.',
        packId: 'base-pack',
        id: 'tpuboch0n1u77pb0uaml2ebp'
      },
      {
        text: 'Uma xícara de chá gostosa.',
        packId: 'base-pack',
        id: 'ldbpx3mu27dqqgj0o855mj6o'
      },
      {
        text: 'Um polvo gay em busca de amor.',
        packId: 'base-pack',
        id: 'u7urzte4ju6qt8ebolwo81u4'
      },
      {
        text: 'Um abacaxi estragado.',
        packId: 'base-pack',
        id: 'coponerw8zqkqehp1ek2orj9'
      },
      {
        text: 'Uma punheta refinada.',
        packId: 'base-pack',
        id: 'wdiq1r5gfl3p99fvjpg17vs2'
      },
      {
        text: 'Um buquê de orações.',
        packId: 'base-pack',
        id: 'l19rwbvarrygbb6ngofg1hsp'
      },
      {
        text: 'Uma pirâmide de cabeças decepadas.',
        packId: 'base-pack',
        id: 'ch2glcmvl1oqgctqg3ovzwlz'
      },
      {
        text: 'Um chapéu muito legal.',
        packId: 'base-pack',
        id: 'v8qtiv3f4qjn7wt9th6s4n0g'
      },
      {
        text: 'Um mongoloide robusto.',
        packId: 'base-pack',
        id: 'dnbmjc1j2fmf29oa74fcgobk'
      },
      {
        text: 'Uma masturbação triste.',
        packId: 'base-pack',
        id: 'zgtct737zlqmltrm86k7uo1i'
      },
      {
        text: 'Um final feliz.',
        packId: 'base-pack',
        id: 'fhjxtswzx44kt1x0xlposzhl'
      },
      {
        text: 'Uma mulher negra e atrevida.',
        packId: 'base-pack',
        id: 'u6w5s1vkw5f50uvm1v5n3pnl'
      },
      {
        text: 'A festa da salsicha.',
        packId: 'base-pack',
        id: 'u7xxi2n0bpmleoj3334bxgua'
      },
      {
        text: 'Um solo de saxofone.',
        packId: 'base-pack',
        id: 'osi6swmh2ztu7d68970fwdyz'
      },
      {
        text: 'Um mar de problemas.',
        packId: 'base-pack',
        id: 'rh66xcbzsrysb2jh1jq06wu6'
      },
      {
        text: 'Um tubarão!',
        packId: 'base-pack',
        id: 'qnu0agohh1eswnjdl100mhgf'
      },
      {
        text: 'Um tomate doente.',
        packId: 'base-pack',
        id: 'chnioyj9tcyxtzamih13vf0g'
      },
      {
        text: 'Uma criança doente.',
        packId: 'base-pack',
        id: 'bvvl4mbl1g3khh21g1jsqcs9'
      },
      {
        text: 'Um plano de seis pontos para parar os barcos.',
        packId: 'base-pack',
        id: 'ir1wc3g5dce1ae11x16ft4bp'
      },
      {
        text: 'Um engradado de Skol e um maço de Derby.',
        packId: 'base-pack',
        id: 'meddouz5ixmfnn7da3uiozyy'
      },
      {
        text: 'Um absorvente um pouco usado.',
        packId: 'base-pack',
        id: 'oddcajtqw72tru7itdrpnlay'
      },
      {
        text: 'Uma tartaruga mordendo a ponta do seu pênis.',
        packId: 'base-pack',
        id: 'ywxv9ctqr3ggcwz5vdjf8bgu'
      },
      {
        text: 'O tio do churrasco que não gosta de batatas.',
        packId: 'base-pack',
        id: 'd8sa4nos9q9370mn3qexax3j'
      },
      {
        text: 'Uma Bolacha Maria molhada.',
        packId: 'base-pack',
        id: 'wvdx0956y0xs0dre5zn33ypo'
      },
      {
        text: 'Um nerd com espasmos.',
        packId: 'base-pack',
        id: 'b4pmm2379ygpeniv3vxcc3gp'
      },
      {
        text: 'Uma fisga de arraia no peito.',
        packId: 'base-pack',
        id: 'bq3hx754awjnzclcsps767hi'
      },
      {
        text: 'Um pelo pubiano perdido.',
        packId: 'base-pack',
        id: 'hbz79w6i66nr9dc5c9k35l99'
      },
      {
        text: 'Uma assinatura da Smart Fit.',
        packId: 'base-pack',
        id: 'cflmqx69vvpir5iuzrn36hds'
      },
      {
        text: 'Uma pistola de água cheia de xixi de gato.',
        packId: 'base-pack',
        id: 'blrrlr5si8wpzw6v1gn2bvj5'
      },
      {
        text: 'Uma quantidade surpreendentemente baixa de estupro na prisão.',
        packId: 'base-pack',
        id: 'hd26i2ae4dur71tnt4hj34ii'
      },
      {
        text: 'Um chute rápido no saco.',
        packId: 'base-pack',
        id: 'd34qg3j9n204vviw744480tr'
      },
      {
        text: 'Uma bomba nuclear.',
        packId: 'base-pack',
        id: 'fkcnte7xoxab43nkgea35jqy'
      },
      {
        text: 'Mil guerreiros escoceses levantando suas saias simultaneamente.',
        packId: 'base-pack',
        id: 'w8h9sryrpr5otapj1y85i68r'
      },
      {
        text: 'Um ménage à trois com minha esposa e o Silvio Santos.',
        packId: 'base-pack',
        id: 'rsxg2zgo6iown5cmkbam28lz'
      },
      {
        text: 'Uma franquia do McDonalds.',
        packId: 'base-pack',
        id: 'hr27kbxg07x6lbbyhxmnxw5v'
      },
      {
        text: 'Um paradoxo de viagem no tempo.',
        packId: 'base-pack',
        id: 'm58gyzamtluie4pobhnwwvl1'
      },
      {
        text: 'Um cavalo minúsculo, que não é pônei.',
        packId: 'base-pack',
        id: 'uyyogjfi77bvdc4qr76axxjg'
      },
      {
        text: 'Um ukulele minúsculo.',
        packId: 'base-pack',
        id: 'mz95eperf3vxeyuc1jtxg0lz'
      },
      {
        text: 'O menor violino do mundo.',
        packId: 'base-pack',
        id: 'mz95eperf3vxeyuc1jtxg0lz'
      },
      {
        text: 'Uma tribo de feministas peludas.',
        packId: 'base-pack',
        id: 'yqvhhn4ksr34hviipx3wtjm4'
      },
      {
        text: 'Uma vagina que tem gosto do chão do bar da esquina.',
        packId: 'base-pack',
        id: 'l1a4jt5faa36iiaij3xslcow'
      },
      {
        text: 'Uma vagina com candidíase.',
        packId: 'base-pack',
        id: 'vlmujoqwquky7kesydmzfu9g'
      },
      {
        text: 'Um sistema de saúde vastamente superior.',
        packId: 'base-pack',
        id: 'gfxkbwi9epxn6jolzuigj5c9'
      },
      {
        text: 'Cocô de um baiano após comer um acarajé.',
        packId: 'base-pack',
        id: 'a3snzjqk6lsd84yp2i4tz2sr'
      },
      {
        text: 'Uma teia de mentiras.',
        packId: 'base-pack',
        id: 'h5rix3rlohux6xp7j1a68bdp'
      },
      {
        text: 'Uma corrida mortal de cadeiras de rodas.',
        packId: 'base-pack',
        id: 'jhvyw3aul0h9fz0v3mlksoef'
      },
      {
        text: 'Um estado étnico branco.',
        packId: 'base-pack',
        id: 'mtdf54ogtb929zxvgrc5hkx3'
      },
      {
        text: 'Dois caras numa moto.',
        packId: 'base-pack',
        id: 'ronzbrf22tifwf61b7ct09df'
      },
      {
        text: 'Um pote inteiro de manteiga.',
        packId: 'base-pack',
        id: 'b1oj6ug2eaw5tpsnx4dp9pa6'
      },
      {
        text: 'Um moinho de vento cheio de cadáveres.',
        packId: 'base-pack',
        id: 'lsllfm94p81l6rwb2r4mch0t'
      },
      {
        text: 'Um terrorista bem-humorado.',
        packId: 'base-pack',
        id: 'cgczfv1ier4k0mmqu6k4xjgd'
      },
      {
        text: 'Um burrito de café da manhã bem temperado.',
        packId: 'base-pack',
        id: 'bp73bc55oishgg9kjmsp4p1l'
      },
      {
        text: 'Dilma Rousseff.',
        packId: 'base-pack',
        id: 'cozqan3kvr78gj52qqsi32zb'
      },
      {
        text: 'Abstinência Alcoólica.',
        packId: 'base-pack',
        id: 'z9j6pzsfuzj7jjxonzz6hc2y'
      },
      {
        text: 'Vencedor do Oscar, Jair Bolsonaro.',
        packId: 'base-pack',
        id: 'cjqamhqaxv43xvc46h077goi'
      },
      {
        text: 'Aceitar as coisas como são.',
        packId: 'base-pack',
        id: 'vfkaer408tr27kpo8jp6jg1o'
      },
      {
        text: 'Acidentalmente dar a si mesmo um Rivotril.',
        packId: 'base-pack',
        id: 'rw59sebx8moja76hi32x49pw'
      },
      {
        text: 'Ouvir ativamente.',
        packId: 'base-pack',
        id: 'ezp4su1nqi8i2ay070sljb1e'
      },
      {
        text: 'Realmente se importar.',
        packId: 'base-pack',
        id: 'm74dsvie1ntmhpcfaqx69f97'
      },
      {
        text: 'Roubar doces de um bebê.',
        packId: 'base-pack',
        id: 'e3uo7ya1335ksses11w4k7mh'
      },
      {
        text: 'Adolescentes grávidas.',
        packId: 'base-pack',
        id: 'axtb6ebl5853vlfg2ipztaej'
      },
      { text: 'Tinder.', packId: 'base-pack', id: 'w33rkkipk3itbx3mapjqdizu' },
      {
        text: 'Conselhos de um sábio negro e velho.',
        packId: 'base-pack',
        id: 'hsqk49nuexy5h30hjb3mwp06'
      },
      {
        text: 'Crianças africanas.',
        packId: 'base-pack',
        id: 'pn3v2x74z0hoqc375lx515vy'
      },
      {
        text: 'Agricultura.',
        packId: 'base-pack',
        id: 'eatnms834hztufd989uskhcg'
      },
      { text: 'AIDS.', packId: 'base-pack', id: 'mijtvl8chs4uh5sn55kzcdok' },
      {
        text: 'Envenenamento por álcool.',
        packId: 'base-pack',
        id: 'xosqdws30r70wl6w6qr0pwid'
      },
      {
        text: 'Alcoolismo.',
        packId: 'base-pack',
        id: 'yhgp4hkiyfo5f72jyews5foh'
      },
      {
        text: 'Silvio Santos',
        packId: 'base-pack',
        id: 'idis41worbxygishmvbeikwa'
      },
      {
        text: 'A arte de ser monobola.',
        packId: 'base-pack',
        id: 'dvkc3ehjca8z5jfg8f4p0oix'
      },
      {
        text: 'Todos os meus pretendentes cavalheiros.',
        packId: 'base-pack',
        id: 'tqaymdff6glbvw4ljtz3xwqk'
      },
      {
        text: 'Todas as calças estão pela metade do preço hoje',
        packId: 'base-pack',
        id: 'ndue5yys09yzz34k4getyw65'
      },
      {
        text: 'Todos os caras com quem transei.',
        packId: 'base-pack',
        id: 'zdiwsmg5iqsmgi5f4c5l7l5s'
      },
      {
        text: 'Camarão à vontade por R$9.90.',
        packId: 'base-pack',
        id: 'uqf4dld8cftcp9heh067y1wt'
      },
      {
        text: 'Coroinhas.',
        packId: 'base-pack',
        id: 'rgeoi8qikp47pog2kkmrdf3n'
      },
      { text: 'Brasil.', packId: 'base-pack', id: 't62skmyv76vrl7ci5dpkfnpq' },
      {
        text: 'Carreta Furacão.',
        packId: 'base-pack',
        id: 'vxeqhf0zri0hun1g6abmuooj'
      },
      {
        text: 'Racistas.',
        packId: 'base-pack',
        id: 'g59j6nbxapgxcs0nl3bixebd'
      },
      {
        text: 'Amputados.',
        packId: 'base-pack',
        id: 'jgasqrvg2ci7dboh54aca3dp'
      },
      {
        text: 'Uma AK-47.',
        packId: 'base-pack',
        id: 'k7xylke5cf0zfb5o8bh5qfxi'
      },
      {
        text: 'Uma AR-15.',
        packId: 'base-pack',
        id: 'c7nmvn7tpyp1vwur4gwp90dq'
      },
      {
        text: 'Uma discussão com o tio Bolsonarista.',
        packId: 'base-pack',
        id: 'ndhb35uhg0uyjcctsk1ntgao'
      },
      {
        text: 'Uma discussão com o tio Esquerdista.',
        packId: 'base-pack',
        id: 'ndhb35uhg0uyjcctsk1ntgao'
      },
      {
        text: 'Uma discussão com Olavo de Carvalho.',
        packId: 'base-pack',
        id: 'ndhb35uhg0uyjcctsk1ntgao'
      },
      {
        text: 'Um exército de viciados em drogas com agulhas infectadas pelo HIV.',
        packId: 'base-pack',
        id: 'q59s1eq1sbn5egheg0efnvg5'
      },
      {
        text: 'Uma cirurgia mal feita.',
        packId: 'base-pack',
        id: 'd8elit4wzzb1yssojrl4ex1v'
      },
      {
        text: 'Diarreia forte.',
        packId: 'base-pack',
        id: 'gc2virh16d6s7ft76mskdrm9'
      },
      {
        text: 'Um sistema de classes enraizado.',
        packId: 'base-pack',
        id: 'krfg62h1txn64ggx2iws2alv'
      },
      {
        text: 'Uma ereção que dura mais de quatro horas.',
        packId: 'base-pack',
        id: 'hur378zgs7to37i0lxqth3m1'
      },
      {
        text: 'Uma Noite com o Danilo Gentili.',
        packId: 'base-pack',
        id: 'xkfbntnut4w4wvh0d35czrzv'
      },
      {
        text: 'Um homem malvado com roupas malvadas.',
        packId: 'base-pack',
        id: 'ihxxhr8mb7y3muhu1k5fhbbc'
      },
      {
        text: 'Um policial honesto que não tem mais nada a perder.',
        packId: 'base-pack',
        id: 'vdduzbsg9yldrunt7lq2lbab'
      },
      {
        text: 'Um lobotomia com picareta de gelo.',
        packId: 'base-pack',
        id: 'wpmyufpew59gjjnm63kd3kkq'
      },
      {
        text: 'Uma punheta fria de uma prostituta barata.',
        packId: 'base-pack',
        id: 'q0ti6hq2ce0wdk0og63qjl0l'
      },
      {
        text: 'Uma reviravolta na trama de La Casa de Papel.',
        packId: 'base-pack',
        id: 'jorwo35ggxjg553e5mm98q2s'
      },
      {
        text: 'Um polvo batendo sete punhetas e fumando um cigarro.',
        packId: 'base-pack',
        id: 'j1r0btk164gc9tdhb9zan44o'
      },
      {
        text: 'Alexandre o Grande.',
        packId: 'base-pack',
        id: 'loqw3s5a0hk9elovru6mcskn'
      },
      {
        text: 'Um velho que está quase morto.',
        packId: 'base-pack',
        id: 'npxdw7j9z6yg0pmkbg6eajtl'
      },
      {
        text: 'Uma coroa conhece beeeem o pênis.',
        packId: 'base-pack',
        id: 'o4uiegjvz4gyz7c2o92rz9z2'
      },
      {
        text: 'Um pirulito gigante.',
        packId: 'base-pack',
        id: 'gqchj1vfsihis2iooovh0zxt'
      },
      {
        text: 'Um rosto feio.',
        packId: 'base-pack',
        id: 'qjn6yoqisqcsj5bzr6bz25hp'
      },
      {
        text: 'Uma erupção cutânea previsível.',
        packId: 'base-pack',
        id: 'odk6gnjio1b81ulttjgic2ny'
      },
      {
        text: 'Uma gravidez indesejada.',
        packId: 'base-pack',
        id: 'anvs3iolrf5eegzwluvx75h7'
      },
      {
        text: 'Um gancho de direita.',
        packId: 'base-pack',
        id: 'bi6yy31q5fil82ql6wo3i0or'
      },
      {
        text: 'Anunciando que estou prestes a gozar.',
        packId: 'base-pack',
        id: 'rkxvyx2tc1lbw2q6rn0mjk3i'
      },
      {
        text: 'Outro maldito filme de vampiro.',
        packId: 'base-pack',
        id: 'aq643jpu8chiaxn38e7mlxvg'
      },
      {
        text: 'Qualquer coisa que saia da boca do príncipe Charles.',
        packId: 'base-pack',
        id: 'av1849qf03ue151cm93i93tj'
      },
      {
        text: 'Pedir desculpas.',
        packId: 'base-pack',
        id: 'wl2g7y8zdna6muwgj5buzzdv'
      },
      {
        text: 'Arnold Schwarzenegger.',
        packId: 'base-pack',
        id: 'mvon91d9a9zfsix7ibxfguez'
      },
      {
        text: 'Asiáticos que não são bons em matemática.',
        packId: 'base-pack',
        id: 'yr7f6xnn84fng1ajm5yvv5s5'
      },
      { text: 'Atitude.', packId: 'base-pack', id: 'up710aie7cc3n57ih9ds7pzn' },
      {
        text: 'Auschwitz.',
        packId: 'base-pack',
        id: 'l6kl1dfwi8i57kd5hsnc1g34'
      },
      {
        text: 'Austrália.',
        packId: 'base-pack',
        id: 'ge83prsqe9hify59cushq9h7'
      },
      {
        text: 'Culinária mexicana autêntica.',
        packId: 'base-pack',
        id: 'llfvtqoltwmssp2djb3tu0tn'
      },
      {
        text: 'Auto-canibalismo.',
        packId: 'base-pack',
        id: 'fcdwp69qpj15fbmf5sz6uuwf'
      },
      {
        text: 'AXE Body Spray.',
        packId: 'base-pack',
        id: 'qsu3d3fg1jr87cwgsdtvxu0q'
      },
      {
        text: 'Abate de texugos.',
        packId: 'base-pack',
        id: 'v67q3rb201o363txixh11er7'
      },
      {
        text: 'Comentário lance a lance do Galvão Bueno.',
        packId: 'base-pack',
        id: 'q5c8v6uvy2zjaetcvdj0k8cm'
      },
      {
        text: 'Bolas. Bolas grandes. Bolas realmente grandes.',
        packId: 'base-pack',
        id: 'ive7fg23kq2rqtbg5ifalm3z'
      },
      {
        text: 'Bananas de pijama.',
        packId: 'base-pack',
        id: 'r9fic5add94zh8v16v9ftmzw'
      },
      { text: 'Bananas.', packId: 'base-pack', id: 'kdno6qjtrxm5ksx325f1lfjm' },
      {
        text: 'Barack Obama.',
        packId: 'base-pack',
        id: 'n6zyv1j6qkjw2gqg9425zwg4'
      },
      {
        text: 'Mal ganhando R$5,000 por ano.',
        packId: 'base-pack',
        id: 'qss2v3jt0g5x0gefdgbcdh2r'
      },
      {
        text: 'Recrutas básicos.',
        packId: 'base-pack',
        id: 'srx378wymr9genyrtehmg2le'
      },
      { text: 'BATMAN!', packId: 'base-pack', id: 'oya7fs76snb4tne79n02oyfg' },
      {
        text: 'BATMAN!!!',
        packId: 'base-pack',
        id: 'ytdufe5itv6w5qgxukj2vo82'
      },
      {
        text: 'Amputações de campo de batalha.',
        packId: 'base-pack',
        id: 'ckmi00hm8dx8nzy21ud7w2bp'
      },
      {
        text: 'Virar um morango.',
        packId: 'base-pack',
        id: 'ly1hh3g4ksbnjibqxsy3tgtl'
      },
      { text: 'Abelhas?', packId: 'base-pack', id: 'xvzbuxs4v6ni18pn4qla44te' },
      {
        text: 'Ser um adulto ocupado com muitas coisas importantes para fazer.',
        packId: 'base-pack',
        id: 'ipssvy5p722ahiky9fbft0c7'
      },
      {
        text: 'Ser um idiota com crianças.',
        packId: 'base-pack',
        id: 'peal25fh80t4f9zg0c99r4k4'
      },
      {
        text: 'Ser um dinossauro.',
        packId: 'base-pack',
        id: 'oyr084c9lwk14s275ubnkhph'
      },
      {
        text: 'Ser uma besta horrenda que ninguém poderia amar.',
        packId: 'base-pack',
        id: 'c6ajhpetntrtal5oom61dwud'
      },
      {
        text: 'Ser um filho da puta feiticeiro.',
        packId: 'base-pack',
        id: 'vbyi9x2hb4x1hell6alnq6em'
      },
      {
        text: 'Ser uma mulher.',
        packId: 'base-pack',
        id: 'p4zn9u31jifc7u5o0shb3eit'
      },
      {
        text: 'Ser capaz de falar com elefantes.',
        packId: 'base-pack',
        id: 'nvtt6hyot55pa1yixgx51qp0'
      },
      {
        text: 'Sendo campeões mundiais consecutivos da guerra!',
        packId: 'base-pack',
        id: 'y79bbrzek4tqns6bepcmfbkx'
      },
      {
        text: 'Ser negro.',
        packId: 'base-pack',
        id: 'vqky5pljil068o7t5t59aagt'
      },
      {
        text: 'Ser canadense.',
        packId: 'base-pack',
        id: 'wjepdpyjrn5xsznwsgc3e1iy'
      },
      {
        text: 'Ser fabuloso.',
        packId: 'base-pack',
        id: 'b0wtbf0pzb3bw42e8ic21ia6'
      },
      {
        text: 'Ser gordo e estúpido.',
        packId: 'base-pack',
        id: 'kmp03ktz0cjlk7xe46wlmomd'
      },
      {
        text: 'Ser caçado como uma raposa.',
        packId: 'base-pack',
        id: 'v6pg2ezq4hca5ahh3o1a00ey'
      },
      {
        text: 'Ser marginalizado.',
        packId: 'base-pack',
        id: 'k5dl9wz2sv5n1fali19dcwgg'
      },
      {
        text: 'Estar pegando fogo.',
        packId: 'base-pack',
        id: 'tjqnzcczjo4onf1zojdghu30'
      },
      {
        text: 'Ser rico.',
        packId: 'base-pack',
        id: 'k88o6kab905bak8bt64wqetn'
      },
      {
        text: 'Ser branco.',
        packId: 'base-pack',
        id: 'jozi08kwdhmildq8t9deh20p'
      },
      {
        text: 'Paulo Muzy.',
        packId: 'base-pack',
        id: 'dfvasx566fl86vblotusbp2j'
      },
      {
        text: 'Bestialidade.',
        packId: 'base-pack',
        id: 'm7s6sxqaz5rtnqsl4rdrf8ab'
      },
      {
        text: 'Bill Nye (o cara da ciência.)',
        packId: 'base-pack',
        id: 'lkqw14e3rc0hv3sbjfm9wql0'
      },
      {
        text: 'Vigiar e punir.',
        packId: 'base-pack',
        id: 'q1ylm48ean5m5wtc76uxujia'
      },
      {
        text: 'Tartarugas Ninja com bafo de bosta.',
        packId: 'base-pack',
        id: 'oxplvb5cysxlhxwyyqznr3u4'
      },
      {
        text: 'Bissexualidade.',
        packId: 'base-pack',
        id: 'brbae58frmag8yrb4w55jv5j'
      },
      { text: 'Vadias.', packId: 'base-pack', id: 'xfcvesmuz9jzefsfnhb7bn5x' },
      {
        text: 'Pessoas negras.',
        packId: 'base-pack',
        id: 'pb092jcq42m9k8y32bpivnm0'
      },
      {
        text: 'Ostentação.',
        packId: 'base-pack',
        id: 'qvu3xvvdfpy4jr26nwkwu7bg'
      },
      {
        text: 'Soco com sangue.',
        packId: 'base-pack',
        id: 'k3d995npzv0aifxvzn5f6t4s'
      },
      {
        text: 'Sangue, suor e lágrimas.',
        packId: 'base-pack',
        id: 'vcu6u55k7699yptzr6skaw1c'
      },
      {
        text: 'Chupar meu namorado tão forte que ele se peida.',
        packId: 'base-pack',
        id: 'koo9127mci4nqnjgqtnczgak'
      },
      {
        text: 'Explodir o Parlamento.',
        packId: 'base-pack',
        id: 'u9ol92jcpzmk890s97tpqn2v'
      },
      { text: 'Cocô.', packId: 'base-pack', id: 'udrewrg2p67gvcp026nbzg7z' },
      {
        text: 'Bond, James Bond.',
        packId: 'base-pack',
        id: 'gapu7l83t4pkuvv9xcsfktin'
      },
      { text: 'Bono.', packId: 'base-pack', id: 'm1oubca0qkb8im5twp2l30t9' },
      {
        text: 'Meleca de nariz.',
        packId: 'base-pack',
        id: 'j35nrwlz3ltao0as6xmcqiwx'
      },
      {
        text: 'Agricultores de frango da Bósnia.',
        packId: 'base-pack',
        id: 'hz3cf7d6682r83job5n5fhba'
      },
      {
        text: 'Trançar os pentelhos.',
        packId: 'base-pack',
        id: 'w32y0a0s7cg87xqlnnf0wmww'
      },
      {
        text: 'Trançar os pentelhos do saco com a Susana Vieira.',
        packId: 'base-pack',
        id: 'bvyvagb31hq1o6cdg4c0o0to'
      },
      {
        text: 'Trançar os pentelhos do saco com o Renato Cariani.',
        packId: 'base-pack',
        id: 'q2aqi9d7gvh5uosc5czd1rxh'
      },
      {
        text: 'Começar a cantar e dançar.',
        packId: 'base-pack',
        id: 'hz9cj3ah7pwhh13i025m64fo'
      },
      { text: 'Brexit.', packId: 'base-pack', id: 'jggb1jr2wo2hc775hllhqks8' },
      {
        text: 'Britney Spears aos 55 anos.',
        packId: 'base-pack',
        id: 'otpo3wmfk31uts8rxhzwvlkr'
      },
      {
        text: 'Pessoas morenas.',
        packId: 'base-pack',
        id: 'adqozbwrusg92mwyig0r64fg'
      },
      {
        text: 'Cagando e andando.',
        packId: 'base-pack',
        id: 'wk4r4aggrkmbyl647sep6sa4'
      },
      {
        text: 'Vandalizar a Praça dos 3 Poderes.',
        packId: 'base-pack',
        id: 'uitk40a84xr5n3vmimebei6f'
      },
      {
        text: 'Netflix canadense.',
        packId: 'base-pack',
        id: 'dz7o4la2mduvkcuv19dvq4jp'
      },
      { text: 'Cardi B.', packId: 'base-pack', id: 'q1g3mg2bo2b9421fkionj5i4' },
      {
        text: 'Cartas Contra a Humanidade.',
        packId: 'base-pack',
        id: 'ga4102b8vipifh5vabjyey88'
      },
      {
        text: 'O Kid Bengala pobre.',
        packId: 'base-pack',
        id: 'my2438oq2fjuwve6ulhc1sut'
      },
      {
        text: 'Sugerir casualmente um ménage à trois.',
        packId: 'base-pack',
        id: 'iruz9wvbdix8wvouohsfrxfk'
      },
      {
        text: 'Catapultas.',
        packId: 'base-pack',
        id: 'r36q9kbgbnk2la1isxt24ba3'
      },
      {
        text: 'Centauros.',
        packId: 'base-pack',
        id: 'v42d1qdwl6ka49x8pscsizbk'
      },
      {
        text: 'Serras elétricas nas mãos.',
        packId: 'base-pack',
        id: 'eet645uml850jl7fa1vy8v8x'
      },
      { text: 'Carisma.', packId: 'base-pack', id: 'qbhp1ictv4eyz22v6d9dqi9i' },
      {
        text: 'Trapacear nas Paraolimpíadas.',
        packId: 'base-pack',
        id: 'lcvroqt183jlj0qcwd259r3m'
      },
      {
        text: 'Sexo anal malicioso.',
        packId: 'base-pack',
        id: 'z009vdwc2o8l1rbiyt5vbkcg'
      },
      {
        text: 'Armas químicas.',
        packId: 'base-pack',
        id: 'cvghp9lmyrhjgusm4hjeummy'
      },
      {
        text: 'Abuso infantil.',
        packId: 'base-pack',
        id: 'kf01lrvz8xrnasi488s212zt'
      },
      {
        text: 'Concursos de beleza infantil.',
        packId: 'base-pack',
        id: 'po2dsn5bgva0h3v4yrnwke3n'
      },
      {
        text: 'Crianças na coleira.',
        packId: 'base-pack',
        id: 'sg6fryaxjbcqw6p70ptm981s'
      },
      {
        text: 'Cavalaria.',
        packId: 'base-pack',
        id: 'h8vz41z5i7p6csau1nl5ifg9'
      },
      {
        text: 'Um mochileiro esquartejado.',
        packId: 'base-pack',
        id: 'ezyve7sst34h1e9uhohnkud4'
      },
      {
        text: 'Pedaços de prostituta morta.',
        packId: 'base-pack',
        id: 'iw6hm7eu5pbwaxar8pur6u29'
      },
      {
        text: 'Baixas civis.',
        packId: 'base-pack',
        id: 'lutj11svrxo7mtoqnqww25ij'
      },
      {
        text: 'Insinuações classistas.',
        packId: 'base-pack',
        id: 'byffqimy5u1ivd7mfd5tgx8m'
      },
      {
        text: 'Corpo macio e sedoso do Lula.',
        packId: 'base-pack',
        id: 'rah63o05bsypdccd17sa4544'
      },
      {
        text: 'Clube de bebês focas.',
        packId: 'base-pack',
        id: 'ujb4ztxqnn7iebvn7y3axgaz'
      },
      {
        text: 'Abortos com cabide.',
        packId: 'base-pack',
        id: 'tq9ww1igk0e4e41lgziufjre'
      },
      {
        text: 'Rinha de galo.',
        packId: 'base-pack',
        id: 'i1b0ntbcdo89z353hsxe1phx'
      },
      {
        text: 'Faculdade.',
        packId: 'base-pack',
        id: 'ioemzqsyd1ptyta7sizhuntk'
      },
      {
        text: 'Suicídio.',
        packId: 'base-pack',
        id: 'syuh4ve3ilzngz3fo5wdm7om'
      },
      {
        text: 'Confiança completamente injustificada.',
        packId: 'base-pack',
        id: 'wh1h3fyyjz51ccq8qld7im8f'
      },
      {
        text: 'Escondendo uma ereção.',
        packId: 'base-pack',
        id: 'ukwvztp61e9jhckgc4txr0ip'
      },
      {
        text: 'Sexo consensual.',
        packId: 'base-pack',
        id: 'kb194z01ilzpzwy3cq871dq5'
      },
      {
        text: 'Sexo não consensual.',
        packId: 'base-pack',
        id: 'kb194z01ilzpzwy3cq871dq5'
      },
      {
        text: 'Consultores.',
        packId: 'base-pack',
        id: 'wna4mmtuob5t5xua5ee2yiix'
      },
      {
        text: 'Câncer de pele contagioso.',
        packId: 'base-pack',
        id: 'mtsy96kf65qdd7r0bu98xlnq'
      },
      {
        text: 'Virar muçulmano.',
        packId: 'base-pack',
        id: 'oviu237ayrfpsyy5k5t0fp06'
      },
      {
        text: 'Dar uma boa apalpada.',
        packId: 'base-pack',
        id: 'qgvhzpjk6fu6et7p2f8c0akj'
      },
      {
        text: 'Banheiros públicos.',
        packId: 'base-pack',
        id: 'rh34tz267l48613188ejs4lv'
      },
      {
        text: 'Reabilitação ordenada pelo tribunal.',
        packId: 'base-pack',
        id: 'v42uy14tb3ol8ico0f69l9e5'
      },
      {
        text: 'Cobrir-me com queijo mussarela e calabresa porque sou uma pizza.',
        packId: 'base-pack',
        id: 'qy49ec1fcql8yn9vdf02dscc'
      },
      {
        text: 'Sexo gostosos com primos.',
        packId: 'base-pack',
        id: 's3wqtqvbhqikwpxjz9wxigex'
      },
      {
        text: 'Dívida esmagadora.',
        packId: 'base-pack',
        id: 'sdqj3qk6600qrlthdv5j9ueo'
      },
      {
        text: 'Crucificação.',
        packId: 'base-pack',
        id: 'h3de1poveophfrcozqk6o9vc'
      },
      {
        text: 'Migalhas por todo o maldito carpete.',
        packId: 'base-pack',
        id: 'kje9xlbd1n3myn0wgseqg2f1'
      },
      {
        text: 'Bolinhos com a Rainha.',
        packId: 'base-pack',
        id: 'cx3lcpen24sv7nuy9i9wtbkb'
      },
      {
        text: 'Metanfetamina.',
        packId: 'base-pack',
        id: 'auwxvhv5nh21ri4a10htx7ep'
      },
      {
        text: 'Carinho.',
        packId: 'base-pack',
        id: 'v7ueaixu791buil1k31zmvos'
      },
      {
        text: 'Gozando profundamente dentro do meu melhor amigo.',
        packId: 'base-pack',
        id: 'zjtcz29dxsd631whtmmr57a7'
      },
      {
        text: 'Representantes de atendimento ao cliente.',
        packId: 'base-pack',
        id: 'l0t4tqzp1cg5lg0ag2r6hfvh'
      },
      {
        text: 'Aprimoramentos cibernéticos.',
        packId: 'base-pack',
        id: 'myiu84fsj8bywobgchvvf7bf'
      },
      {
        text: 'Questões com o papai.',
        packId: 'base-pack',
        id: 'dwmbz1l60uhsz5s3c4v1ifhs'
      },
      {
        text: 'Cartão de crédito do papai.',
        packId: 'base-pack',
        id: 'e5hw61tnipnej1ru15urio8a'
      },
      {
        text: 'A bundinha do Robert Pattinson.',
        packId: 'base-pack',
        id: 'xaheo89k0jjhguvzf66q0aay'
      },
      {
        text: 'Forças escuras e misteriosas além de nosso controle.',
        packId: 'base-pack',
        id: 'tpnphg7a8ibgu5656ey89xtn'
      },
      {
        text: 'Darth Vader.',
        packId: 'base-pack',
        id: 't01u80xceehsp2rxas6ufw4j'
      },
      { text: 'Estupro.', packId: 'base-pack', id: 'chk20a8hcxtdxsnudcucvae2' },
      {
        text: 'Monark defendendo Nazismo.',
        packId: 'base-pack',
        id: 'ncqzg8iqqpjl49hkffg3vx4g'
      },
      {
        text: 'Bebês mortos.',
        packId: 'base-pack',
        id: 'bpz38jpo3m05tc6hxfcaqrwn'
      },
      {
        text: 'Pássaros mortos por toda parte.',
        packId: 'base-pack',
        id: 'hxh2m7lhofmn6ddbx5fdnfh5'
      },
      {
        text: 'Pais mortos.',
        packId: 'base-pack',
        id: 'i0y2621cetn6qwsd5otp2q8l'
      },
      {
        text: 'Deflorar a princesa.',
        packId: 'base-pack',
        id: 'qfjrxsy4ow7rko47pait7xgf'
      },
      {
        text: 'Barreiras dentárias.',
        packId: 'base-pack',
        id: 'gthmk8hcub9s3yr79yl08i8w'
      },
      {
        text: 'Negar sexo para jogar videogame.',
        packId: 'base-pack',
        id: 'fxjs7tgl496em46gxzlrtamb'
      },
      {
        text: 'Destruir as evidências.',
        packId: 'base-pack',
        id: 'xsoy7kiff6w39kaogd2ebwtz'
      },
      {
        text: 'Dedos de pau.',
        packId: 'base-pack',
        id: 'stl7fj3cg2v2a9gxb0n1nsy1'
      },
      {
        text: 'Fotos de pênis.',
        packId: 'base-pack',
        id: 'k2bqswpk31r81d04r9pjbpll'
      },
      {
        text: 'Jantar com recortes de papelão do elenco de Friends.',
        packId: 'base-pack',
        id: 'cxtvt1rjlste12u45gczo0em'
      },
      {
        text: 'Fraldas sujas.',
        packId: 'base-pack',
        id: 'yc8xdl9m29qwxtv22qzzpzf0'
      },
      {
        text: 'Diversidade.',
        packId: 'base-pack',
        id: 'tdlncx0h7ld57t3a4leezapf'
      },
      {
        text: 'Fingir de cachorrinho.',
        packId: 'base-pack',
        id: 'jhlmjlyxaq1uld5054wjto5c'
      },
      {
        text: 'Fazendo sexo anal.',
        packId: 'base-pack',
        id: 'z7ok858l4bfq3ywn48pgk1py'
      },
      {
        text: 'Cometendo crimes.',
        packId: 'base-pack',
        id: 'd8phljclo8c5ulghlup8odao'
      },
      {
        text: 'Fazendo a coisa certa.',
        packId: 'base-pack',
        id: 'ed3mc60w4p2hphrnd120plj8'
      },
      {
        text: 'Donald J. Trump.',
        packId: 'base-pack',
        id: 'fbb36gqw30aiw65p1w3rmf8i'
      },
      {
        text: 'Tweets apagados de Donald Trump.',
        packId: 'base-pack',
        id: 'rv3ik6d0dl4znl2x66p7dmeo'
      },
      {
        text: 'Arco-íris duplo.',
        packId: 'base-pack',
        id: 'ak57vjp929j18i4jbq7xeeoo'
      },
      {
        text: 'Imbecis no iPhone.',
        packId: 'base-pack',
        id: 'e25z6uspk6y5bre2a2a4wlln'
      },
      {
        text: 'Dr. Martin Luther King, Jr.',
        packId: 'base-pack',
        id: 'hbt7syn0y3eyej82onm2lsx6'
      },
      {
        text: 'Bebendo sozinho(a).',
        packId: 'base-pack',
        id: 'khcvmnjxh9j5ltgua4rttne1'
      },
      {
        text: 'Bebendo água do vaso sanitário e comendo lixo.',
        packId: 'base-pack',
        id: 'luv1ik17uwq60b6pfj94x2ze'
      },
      {
        text: 'Deixando um bebê cair na privada.',
        packId: 'base-pack',
        id: 'eczmcu5a6vxekohsxlw7j9t0'
      },
      {
        text: 'Deixando um lustre cair sobre seus inimigos e subindo pela corda.',
        packId: 'base-pack',
        id: 'w34yif0h0qmp8s0e6n7juier'
      },
      {
        text: 'Afogando as crianças na banheira.',
        packId: 'base-pack',
        id: 'aruq0snrzmtsbktdw7lhxupj'
      },
      { text: 'Incas.', packId: 'base-pack', id: 'hxoog873k2r4qmweth0nts5h' },
      { text: 'Maias.', packId: 'base-pack', id: 'hxoog873k2r4qmweth0nts5h' },
      { text: 'Astecas.', packId: 'base-pack', id: 'hxoog873k2r4qmweth0nts5h' },
      {
        text: 'Círculos de tambores.',
        packId: 'base-pack',
        id: 'ne3ncaxvr8t5j59nxlgsz0gj'
      },
      {
        text: 'Ânsia de vômito.',
        packId: 'base-pack',
        id: 'or9beyhiwfwbkrjh0vysz2eh'
      },
      {
        text: 'Arremesso de anão.',
        packId: 'base-pack',
        id: 'brcmex5kdzbcschppl1b202s'
      },
      {
        text: 'Dwayne "The Rock" Johnson.',
        packId: 'base-pack',
        id: 'c425rjx54vxri93q25t5n07x'
      },
      {
        text: 'Morrendo, mas ressucitando.',
        packId: 'base-pack',
        id: 'v04da03w9qpthrivgcso79y1'
      },
      {
        text: 'Morrer de disenteria.',
        packId: 'base-pack',
        id: 'da7yd4z5l19rwo62qmhv1icz'
      },
      { text: 'Morrer.', packId: 'base-pack', id: 'k78lb7ff9ktg146po0clewr4' },
      {
        text: 'Um funkão nervoso.',
        packId: 'base-pack',
        id: 'scanb8it0g4jh1dgyajh6bk8'
      },
      {
        text: 'Comer todos os biscoitos antes da venda beneficente contra a AIDS.',
        packId: 'base-pack',
        id: 'fic5l2e8le9sjue3npyceykp'
      },
      {
        text: 'Comer um albino.',
        packId: 'base-pack',
        id: 'gdmfxzax7m8u0lfctndg26ej'
      },
      {
        text: 'Comer o último bisão conhecido.',
        packId: 'base-pack',
        id: 'gjunjvdieewx047oeq3f2cfw'
      },
      {
        text: 'Comer demais.',
        packId: 'base-pack',
        id: 'azz96j829r2csodpxkzchfsm'
      },
      { text: 'Êxtase.', packId: 'base-pack', id: 'reb5ozacxa13ozb9u4gfn85q' },
      {
        text: 'Cuecas comestíveis.',
        packId: 'base-pack',
        id: 'evmq5tls7hx9l7q73tat57yc'
      },
      {
        text: 'Roupa íntima comestível.',
        packId: 'base-pack',
        id: 'g4i4ktpd1csszppugntvfuxd'
      },
      {
        text: 'Atirar ovos em um membro do parlamento.',
        packId: 'base-pack',
        id: 'u7mbsuwrgvra7bgdqjurg5tg'
      },
      {
        text: 'Homens japoneses idosos.',
        packId: 'base-pack',
        id: 'mfkft4visy323yryhe2ydvlw'
      },
      {
        text: 'Eletricidade.',
        packId: 'base-pack',
        id: 'i8uwq1339559g2xhsf8ltdqb'
      },
      {
        text: 'Células-tronco embrionárias.',
        packId: 'base-pack',
        id: 's7v6eqzu5v7vmtsgnzjgv0zn'
      },
      {
        text: 'Emergindo do mar e causando estragos em Tóquio.',
        packId: 'base-pack',
        id: 'dspyvd3914wokqh1npcjtbbx'
      },
      {
        text: 'Tatá Werneck.',
        packId: 'base-pack',
        id: 'hgjlf4mhb8y5wg6txt6nn8xq'
      },
      { text: 'Emoções.', packId: 'base-pack', id: 'qe43wyschophoojl47cj7fdn' },
      {
        text: 'Inglaterra.',
        packId: 'base-pack',
        id: 'jtg41u2ikh8huskyw9xelsqx'
      },
      {
        text: 'Disfunção erétil.',
        packId: 'base-pack',
        id: 'jmkvf0tlp9fpkxsl6sdqtiky'
      },
      {
        text: 'Estabelecendo dominância.',
        packId: 'base-pack',
        id: 'pcucwwwglqspwco81kb65dt7'
      },
      {
        text: 'Eternamente incrível.',
        packId: 'base-pack',
        id: 'zw5l4x6nnq782lr0dwydq0w0'
      },
      {
        text: 'Limpeza étnica.',
        packId: 'base-pack',
        id: 'mdmjzxmszkl60o4398l2ewkp'
      },
      { text: 'Eugenia.', packId: 'base-pack', id: 'qvx6f92wwl02htgmxgam1n3h' },
      {
        text: 'Malbec™ da oBoticário.',
        packId: 'base-pack',
        id: 'gbtl0lsncnsye7smixurjyfs'
      },
      {
        text: 'Exatamente o que você esperaria.',
        packId: 'base-pack',
        id: 'ndxu7qj85ivru3uhmhez0eh8'
      },
      {
        text: 'Excalibur.',
        packId: 'base-pack',
        id: 'm8vtlnhxm4750hfq3jmud9u8'
      },
      {
        text: 'Troca de gentilezas.',
        packId: 'base-pack',
        id: 'am1c2pl0477cgs9lef06gqdm'
      },
      {
        text: 'Executar um refém a cada hora.',
        packId: 'base-pack',
        id: 'ujioxforfyjb2zgspy1txav6'
      },
      {
        text: 'Existencialistas.',
        packId: 'base-pack',
        id: 'bja71emt2gt1kv94aaxnfwh4'
      },
      {
        text: 'Exorcismo.',
        packId: 'base-pack',
        id: 'bj71gu9f051yofscl8y86lgu'
      },
      {
        text: 'Esperar um arroto e vomitar no chão.',
        packId: 'base-pack',
        id: 'u8kvewslhwmg9ig622hias03'
      },
      {
        text: 'Explicando como vaginas funcionam.',
        packId: 'base-pack',
        id: 'rf4sxo8hvilujgjru4vae8hw'
      },
      {
        text: 'Explosões.',
        packId: 'base-pack',
        id: 'duiufrkj3m53qdkj221w43gt'
      },
      {
        text: 'Calças extremamente apertadas.',
        packId: 'base-pack',
        id: 'pmx1ptzqj9v3srg4biby1nw3'
      },
      {
        text: 'Facebook.',
        packId: 'base-pack',
        id: 'cmq5mdivdqb8f7aufhmq5n9y'
      },
      {
        text: 'Sumir no nada.',
        packId: 'base-pack',
        id: 'khd8cq65eq9drwa047zwbutb'
      },
      {
        text: 'Perdendo tempo com bobagens.',
        packId: 'base-pack',
        id: 'm29tylvdx0l8zyyty8v361yz'
      },
      {
        text: 'Cura pela fé.',
        packId: 'base-pack',
        id: 'dnx2rz2y5eocvqqnldbix6oe'
      },
      {
        text: 'Implantes de silicone falsos.',
        packId: 'base-pack',
        id: 'ebm48gjoq0zgcdek0800et1q'
      },
      { text: 'Fome.', packId: 'base-pack', id: 'uywprrlek4i7hoep8r4qtlp4' },
      {
        text: 'Peidar e sair andando.',
        packId: 'base-pack',
        id: 'msfigxfmrifnpqs7cfbq9qtm'
      },
      {
        text: 'O medo de si.',
        packId: 'base-pack',
        id: 'dfh634wqm9gg9a7x4huh6gvv'
      },
      {
        text: 'Comunhão em Cristo.',
        packId: 'base-pack',
        id: 'm2boh8ipu8kv2zetggyhhbmp'
      },
      {
        text: 'Fezes em chamas.',
        packId: 'base-pack',
        id: 'bow5d3cxz8wxcvu91z20ekmq'
      },
      {
        text: 'Enchendo minha maleta com coisas de trabalho.',
        packId: 'base-pack',
        id: 'k6l180yzw1dt5q63fhf6wz6t'
      },
      {
        text: 'Enchendo meu filho com espaguete.',
        packId: 'base-pack',
        id: 'pr3hn1em96iuinkag6brj79y'
      },
      {
        text: 'Enchendo a Taís Carla com hélio e assistindo ela flutuar para longe.',
        packId: 'base-pack',
        id: 'gwoukre5iuzu6l0be5eahcku'
      },
      {
        text: 'Pintura com os dedos.',
        packId: 'base-pack',
        id: 'wgehsizcw7j6p2yrtmn075kg'
      },
      { text: 'Fingir.', packId: 'base-pack', id: 'rmttjybqrwx1pn4rog19p9k2' },
      {
        text: 'Disparando um rifle para o alto enquanto está enfiado até o fundo em um porco guinchando.',
        packId: 'base-pack',
        id: 'qo9do2jojmacderqnolyga1w'
      },
      {
        text: 'Colocando todas as suas coisas em uma sacola de marinheiro.',
        packId: 'base-pack',
        id: 'uv5p4sbz2bc1s6aggb2q332o'
      },
      {
        text: 'Cinco litros do drink da casa.',
        packId: 'base-pack',
        id: 't215hw4m9gj555pq5wqycfyp'
      },
      {
        text: 'Putas de cinco reais.',
        packId: 'base-pack',
        id: 'ag1tiz5s95uukeddcro7nhgz'
      },
      {
        text: 'Camisinhas com sabor.',
        packId: 'base-pack',
        id: 'z9v6sd6t3ed5s076ctqtz96c'
      },
      {
        text: 'Bactérias carnívoras.',
        packId: 'base-pack',
        id: 'we8mk7o28mjzx4krdsklflzc'
      },
      {
        text: 'Aves não voadoras.',
        packId: 'base-pack',
        id: 'kqy7mq1e7ufhcvpmdy0uebgb'
      },
      {
        text: 'Discos voadores.',
        packId: 'base-pack',
        id: 'ao4ly9zn4d5gtl1pk17ixdys'
      },
      {
        text: 'Cobras voadoras do sexo.',
        packId: 'base-pack',
        id: 'rcag1ygp4lae3hukgu77l1z0'
      },
      {
        text: 'Esterilização forçada.',
        packId: 'base-pack',
        id: 'kya3a3udbktzq9l8vjdt3g8r'
      },
      { text: 'Fimose.', packId: 'base-pack', id: 'vvewdd0lgxtfina935xbhr08' },
      {
        text: 'Esquecer o Alamo.',
        packId: 'base-pack',
        id: 'xkz77j1fjjcka9q6qiw1d92v'
      },
      {
        text: 'Ex-presidente George W. Bush.',
        packId: 'base-pack',
        id: 'jpznu2czcdea9gapmrawhasq'
      },
      {
        text: 'Globo News.',
        packId: 'base-pack',
        id: 'nnxidyi2e2d4ltve5pb78n1f'
      },
      {
        text: 'Masculinidade frágil.',
        packId: 'base-pack',
        id: 'xsxr0a842rng0rfmgcen0flc'
      },
      {
        text: 'Amostras grátis.',
        packId: 'base-pack',
        id: 'ridmn3v7kosmqbiw2k72ggyi'
      },
      { text: 'Fricção.', packId: 'base-pack', id: 'da8zzrvsdkmj5a0ghdf7b8qt' },
      {
        text: 'Fogo amigo.',
        packId: 'base-pack',
        id: 'dboehg73clxbnor7eainsj2o'
      },
      {
        text: 'Amigos que comem todos os lanches.',
        packId: 'base-pack',
        id: 'nck5vszwvm6nlcioicxl5aad'
      },
      {
        text: 'Amizades com benefícios.',
        packId: 'base-pack',
        id: 'sus4odgl53p4sdumbnrl9de9'
      },
      {
        text: 'Brincadeira animada.',
        packId: 'base-pack',
        id: 'a6gts4iemeqe0o1n41eq0gzq'
      },
      {
        text: 'Traseira frontal.',
        packId: 'base-pack',
        id: 'uiidr7qvg6b29e2b58vy3l6j'
      },
      {
        text: 'Transando com minha irmã.',
        packId: 'base-pack',
        id: 'c0jiqca0i8f73j3ya6d5kt0q'
      },
      {
        text: 'Transando com o apresentador do tempo ao vivo na televisão.',
        packId: 'base-pack',
        id: 'btslidqg0r1i5pockqy93mru'
      },
      {
        text: 'Nudez completa.',
        packId: 'base-pack',
        id: 'wv8opt3itpa0d20gvlcqj1iv'
      },
      {
        text: 'Rimas super divertidas.',
        packId: 'base-pack',
        id: 'dmse17pt7pc4mgderc1jfnhf'
      },
      { text: 'Gandalf.', packId: 'base-pack', id: 'pknlyl1nau55b4gfc6yi8t3y' },
      { text: 'Gandhi.', packId: 'base-pack', id: 'veyu1qa7hv1uc7rhnsa9z1xd' },
      {
        text: 'Animais gays.',
        packId: 'base-pack',
        id: 'pv30ty3z8y3slmi2636mm715'
      },
      {
        text: 'Terapia de conversão gay.',
        packId: 'base-pack',
        id: 'mdg1j09364q5xjsq7wlg5mso'
      },
      {
        text: 'Cura gay.',
        packId: 'base-pack',
        id: 'mdg1j09364q5xjsq7wlg5mso'
      },
      { text: 'Gansos.', packId: 'base-pack', id: 'wzmx6lfg98pghge2hh0jlp42' },
      {
        text: 'Super-soldados geneticamente modificados.',
        packId: 'base-pack',
        id: 'zt0bvxiing1xezb79b7ez7xr'
      },
      {
        text: 'Genghis Khan.',
        packId: 'base-pack',
        id: 'lka0ktcxkjqqiho6okm9ib5r'
      },
      {
        text: 'Piercings genitais.',
        packId: 'base-pack',
        id: 'c574112cmyky2lbycpyqgdxh'
      },
      {
        text: 'Conexão humana genuína.',
        packId: 'base-pack',
        id: 'zqbvdjqebqyecr91lr4k2e66'
      },
      {
        text: 'Chanceler alemã Angela Merkel.',
        packId: 'base-pack',
        id: 'xfxy8xcxl7lg6ag2dfh4sho0'
      },
      {
        text: 'BDSM alemão.',
        packId: 'base-pack',
        id: 'q231pkfq6przh9hejpdvp0ws'
      },
      {
        text: 'Alemães de férias.',
        packId: 'base-pack',
        id: 'rub7lgsvm9xrion7kcr0gmm7'
      },
      {
        text: 'Receber uma multa dirigindo um Tobatta.',
        packId: 'base-pack',
        id: 'np8geadifdtpzrbn52bmkgil'
      },
      {
        text: 'Ser esmagado por uma máquina de venda.',
        packId: 'base-pack',
        id: 'srwkm5p7qhca1w75hjhks7wu'
      },
      {
        text: 'Ser ejaculado.',
        packId: 'base-pack',
        id: 'p6i7dm8fy8s89dsxbneqidti'
      },
      {
        text: 'Tirar drogas das ruas e usá-las.',
        packId: 'base-pack',
        id: 'eat3zo0huqgwgtl0ij50a782'
      },
      {
        text: 'Ficar bêbado com enxaguante bucal.',
        packId: 'base-pack',
        id: 'ztvr3ynsh0wdqgbxhkog3k1a'
      },
      {
        text: 'Sendo dedilhado(a).',
        packId: 'base-pack',
        id: 'u3is8i2w9on3dvob6gsnwyiy'
      },
      {
        text: 'Envolvendo-se em um acidente de carro bem grave.',
        packId: 'base-pack',
        id: 'f421sswyyzjpdyksbmyulr79'
      },
      {
        text: 'Casar, ter alguns filhos, comprar algumas coisas, se aposentar na Flórida e morrer.',
        packId: 'base-pack',
        id: 'u5zrdxya6mbrz6q9p3ktv7w4'
      },
      {
        text: 'Casar, ter alguns filhos, comprar algumas coisas, se aposentar nas Maldivas e morrer.',
        packId: 'base-pack',
        id: 'svbn92dxa2ci3268809n0mkv'
      },
      {
        text: 'Casar, ter alguns filhos, comprar algumas coisas, se aposentar no sul da França e morrer.',
        packId: 'base-pack',
        id: 'pdk6g6kkpbvoahv8xunz7wdd'
      },
      {
        text: 'Ficar nu(a) e assistir Cartoon Network.',
        packId: 'base-pack',
        id: 'xxvdrm0eb5w1j0oh9kqqbjbb'
      },
      {
        text: 'Ficar nu(a) e assistir Nickelodeon.',
        packId: 'base-pack',
        id: 'xjljb136t6ipkdat2a72ufta'
      },
      {
        text: 'Ficar nu(a) e assistir TV Globinho.',
        packId: 'base-pack',
        id: 'gxy4t24x6tg44jte0bbnun4z'
      },
      {
        text: 'Engravidar novamente.',
        packId: 'base-pack',
        id: 'tf04h9r0osf9ing3mm5g9yj6'
      },
      {
        text: 'Ficar muito chapado(a).',
        packId: 'base-pack',
        id: 'f970joqpo2iswo3seqy3u4ob'
      },
      {
        text: 'Ficar tão bravo(a) que fica excitado(a).',
        packId: 'base-pack',
        id: 'szhtlx9fsp56nzqf32hu1ipz'
      },
      // TODO: stopped here
      {
        text: 'Fantasmas.',
        packId: 'base-pack',
        id: 'u97wmopuobupcaucr3qimyz7'
      },
      {
        text: 'Garotas que não deveriam se soltar.',
        packId: 'base-pack',
        id: 'cv7dq25rfok8v34lklwun551'
      },
      { text: 'Garotas.', packId: 'base-pack', id: 'qvdbaeztq10tz4fzefdo8f7t' },
      {
        text: 'Dar 110%.',
        packId: 'base-pack',
        id: 'grmx8mlugp02zskj1cpcaomc'
      },
      {
        text: 'Dar à luz o Anticristo.',
        packId: 'base-pack',
        id: 'slop1rsm2bwiiyhkaea2eo3i'
      },
      {
        text: 'Combates gladiatórios.',
        packId: 'base-pack',
        id: 'szbzuegv5jtr65gfwnpw9twl'
      },
      {
        text: 'Quebrar uma garrafa em um idiota.',
        packId: 'base-pack',
        id: 'f4a5ekygasundw6z8wy421mx'
      },
      {
        text: 'Glenn Beck sendo importunado por um bando de urubus.',
        packId: 'base-pack',
        id: 'eso7q3jr579ugl8rg4a7njvl'
      },
      {
        text: 'Glenn Beck enganchando seu escroto em um gancho de cortina.',
        packId: 'base-pack',
        id: 'xgg7mjdicepbju8wpzrw3b1l'
      },
      {
        text: 'Glenn Beck vomitando convulsivamente enquanto uma ninhada de aranhas caranguejeiras eclode em seu cérebro e sai pelos ductos lacrimais.',
        packId: 'base-pack',
        id: 'zctu8qewhc9fwnfqdmyxli57'
      },
      {
        text: 'Glenn Beck.',
        packId: 'base-pack',
        id: 'uyj0p42kcw1x4h6j6mcewu49'
      },
      {
        text: 'Aquecimento global.',
        packId: 'base-pack',
        id: 'kb6yr1eao08r6ergvqcoh3ya'
      },
      {
        text: 'Gloryholes.',
        packId: 'base-pack',
        id: 'r4dlzs4azznmfvwc0vch81kj'
      },
      {
        text: 'Cabras comendo latas.',
        packId: 'base-pack',
        id: 'ryujqfzp1e7q1olkarfxrx1f'
      },
      { text: 'Goblins.', packId: 'base-pack', id: 'ie5l3bvjnuygt3l9l21pvake' },
      { text: 'Deus.', packId: 'base-pack', id: 'xxymjjegiil1l37inmg8hl1f' },
      { text: 'GoGurt®.', packId: 'base-pack', id: 'zofh4hnvqxm25jqaslvdfyg0' },
      {
        text: 'Passar um dia inteiro sem se masturbar.',
        packId: 'base-pack',
        id: 'vpwo6zz5a8j2vg7eifuvc2h9'
      },
      {
        text: 'Andar por aí cheirando as axilas das pessoas.',
        packId: 'base-pack',
        id: 'r980ecsova4j3h8dda7gtgo1'
      },
      {
        text: 'Chuvas douradas.',
        packId: 'base-pack',
        id: 'tl4bbsjnqhaji15rtmjnezl9'
      },
      {
        text: 'Racismo descontraído e divertido dos australianos.',
        packId: 'base-pack',
        id: 'as4v6fd1y8ep1kp2nqbt326j'
      },
      { text: 'Vovó.', packId: 'base-pack', id: 'hxehquu75ngx6h6j51yqrirn' },
      {
        text: 'A careca do vovô.',
        packId: 'base-pack',
        id: 'qi1c08cqqm1fgyfyjvcihaq9'
      },
      {
        text: 'Apoio popular.',
        packId: 'base-pack',
        id: 'is9s8c91wqi7b23i3467njd6'
      },
      {
        text: 'Tumultuar túmulos.',
        packId: 'base-pack',
        id: 'c9z6zb6o35qpjj6agpqkcvk1'
      },
      {
        text: 'Criar coragem.',
        packId: 'base-pack',
        id: 'uhtoairhun9xjyosgaklsh46'
      },
      {
        text: 'Caras que não ligam.',
        packId: 'base-pack',
        id: 'agyk54fghhnt44chq7b90oq1'
      },
      { text: 'Haggis.', packId: 'base-pack', id: 'zc2rohuxrj9dg0u5aj3g3gvn' },
      {
        text: 'Meio quilo de heroína pura.',
        packId: 'base-pack',
        id: 'h17iafbktvece012q0kp3f09'
      },
      {
        text: 'Preliminares malfeitas.',
        packId: 'base-pack',
        id: 'j25ld0xiogh1lv88rgp92ndj'
      },
      {
        text: 'Erotismo de Harry Potter.',
        packId: 'base-pack',
        id: 'hbgmvgij7fo1n03krmq0v8qx'
      },
      {
        text: 'Tenha um pouco mais de kugel.',
        packId: 'base-pack',
        id: 'la09yjk8jru53ujjkve87xyg'
      },
      {
        text: 'Ter um Golden Gaytime.',
        packId: 'base-pack',
        id: 'nuzx96smceaf77hl9svg8nco'
      },
      {
        text: 'Ter um pênis.',
        packId: 'base-pack',
        id: 'k6yj37a9eyw8kp4hcwsqtyvo'
      },
      {
        text: 'Fazer sexo no banco de trás de uma caminhonete.',
        packId: 'base-pack',
        id: 'vxcr3ukbel850xjt1wi7zegm'
      },
      {
        text: 'Ter ânus no lugar dos olhos.',
        packId: 'base-pack',
        id: 'c95fuff5tqkkccu5b323v917'
      },
      {
        text: 'Ter grandes sonhos, mas sem uma maneira realista de alcançá-los.',
        packId: 'base-pack',
        id: 'ms3r0owswbgvw2mny2vs7eb6'
      },
      {
        text: 'Fazer sexo pela primeira vez.',
        packId: 'base-pack',
        id: 'p0g9pb6n4p5c0tq86j1tv2kt'
      },
      {
        text: 'Fazer sexo muito cedo após dar à luz.',
        packId: 'base-pack',
        id: 'nbfqv24h1b13ymzhmimvpyz5'
      },
      {
        text: 'Fazer sexo com todos os homens em Winnipeg.',
        packId: 'base-pack',
        id: 'pk48dbe5gudy7kobaag1qms0'
      },
      {
        text: 'Fazer sexo desleixado enquanto seu cachorro assiste.',
        packId: 'base-pack',
        id: 'lrqptobse4vg0reqg7oledc9'
      },
      {
        text: 'Órfãos emocionantes.',
        packId: 'base-pack',
        id: 'hk68f9eza2xnxc4y1bectwaz'
      },
      {
        text: 'Heath Ledger.',
        packId: 'base-pack',
        id: 'mc23pyre3w9qru7y52cwpecu'
      },
      {
        text: 'Rir descontroladamente ao mencionar Hutus e Tutsis.',
        packId: 'base-pack',
        id: 'cu8wfe4sk6lpyur1i3rva0kw'
      },
      {
        text: 'Sua Majestade, a Rainha Elizabeth II.',
        packId: 'base-pack',
        id: 'dh5fxb8m3e6t9wluote4aal2'
      },
      {
        text: 'Sua Alteza Real, a Rainha Elizabeth II.',
        packId: 'base-pack',
        id: 'pkh8rv6ignsi97spaiko4e0o'
      },
      {
        text: 'Minutos históricos.',
        packId: 'base-pack',
        id: 'jgggnwzz2qbm9nwge8odex0i'
      },
      {
        text: 'Imagens italianas hermafroditas.',
        packId: 'base-pack',
        id: 'ckabptgwb1p2hfr9iapu35m4'
      },
      { text: 'Heroína.', packId: 'base-pack', id: 'vv6h1gh8ybm736blwc3f98oc' },
      {
        text: 'Heteronormatividade.',
        packId: 'base-pack',
        id: 'isz07kurbirf9r08gidf45lc'
      },
      {
        text: 'Grampos de mamilo favoritos de Hillary Clinton.',
        packId: 'base-pack',
        id: 'i0l4v1ifdkudv2zvmtsl1buh'
      },
      {
        text: 'Joias de hip hop.',
        packId: 'base-pack',
        id: 'w0ap7hl0bc8w7nsspksuvk7g'
      },
      {
        text: 'Hipsters.',
        packId: 'base-pack',
        id: 'u5zxkibugl4kb7t8bgj5w30d'
      },
      {
        text: 'Faculdades historicamente negras.',
        packId: 'base-pack',
        id: 'y8lsg4tb20qro43tbmrb4139'
      },
      { text: 'Hobos.', packId: 'base-pack', id: 'cp1195hw026prohfn7q7mdba' },
      {
        text: 'Segurar uma criança e soltar flatulências sobre ela.',
        packId: 'base-pack',
        id: 'mh98hm6dwlcdy4vqtmtn71x7'
      },
      {
        text: 'Vídeo caseiro de Oprah chorando em um Lean Cuisine®.',
        packId: 'base-pack',
        id: 'pwrfr2q0nxk074drl94l9118'
      },
      {
        text: 'Pessoas sem-teto.',
        packId: 'base-pack',
        id: 'yoo0ereuj6eaestknzqs4nxj'
      },
      {
        text: 'Leite homo.',
        packId: 'base-pack',
        id: 'dhpwf95vnb0abx3100j1icwr'
      },
      {
        text: 'Fazer racha.',
        packId: 'base-pack',
        id: 'lnd0n52rc878c26f2zp6gt0t'
      },
      {
        text: 'Esperança.',
        packId: 'base-pack',
        id: 'uooe2xcwqv0of6cvlfycogae'
      },
      {
        text: 'Injeções hormonais.',
        packId: 'base-pack',
        id: 'lnjqejpxd07kty9z9btqkg8j'
      },
      {
        text: 'Acidentes horríveis de remoção de pelos a laser.',
        packId: 'base-pack',
        id: 'x12tpl9uq2elgnqj244nxogh'
      },
      {
        text: 'Carne de cavalo.',
        packId: 'base-pack',
        id: 'ic2gupzzb8pajkmhe2hc5ki0'
      },
      {
        text: 'Cuidados paliativos.',
        packId: 'base-pack',
        id: 'lypakrarop1k0zlodmwzijx3'
      },
      {
        text: 'Queijo quente.',
        packId: 'base-pack',
        id: 'v0z8079c0waaflexdpfrpkop'
      },
      {
        text: 'Pessoas atraentes.',
        packId: 'base-pack',
        id: 'b4s6aezc3ra669p09dtg30k4'
      },
      {
        text: 'Hot Pockets®.',
        packId: 'base-pack',
        id: 'cgfo8yhpjnp6jxb8r9biauwb'
      },
      {
        text: 'Como é incrível estar sob efeito de cogumelos.',
        packId: 'base-pack',
        id: 'mkztoxtn1vaddtymd4ixifac'
      },
      {
        text: 'O quão incrível é ser branco.',
        packId: 'base-pack',
        id: 'f9l4tvlgh3wz7d83kegt5hov'
      },
      {
        text: 'O quanto minha filha estragou sua apresentação de dança.',
        packId: 'base-pack',
        id: 'fjprwio8y37r0yar00eu4b66'
      },
      {
        text: 'O quão longe consigo enfiar meu próprio pênis no meu traseiro.',
        packId: 'base-pack',
        id: 'nw0909yig8obu50emql2wzmt'
      },
      {
        text: 'O quão molhada está minha vagina.',
        packId: 'base-pack',
        id: 'xosr5n8oj9n4sht2zvqbs85j'
      },
      {
        text: 'Quanta maconha £20 pode comprar.',
        packId: 'base-pack',
        id: 'fl18i20a12hg820ylhht2008'
      },
      {
        text: 'Cheirar tinta spray.',
        packId: 'base-pack',
        id: 'w4poluvoihl5h80x7mfv8rso'
      },
      {
        text: 'Bíceps enormes.',
        packId: 'base-pack',
        id: 'bsaoz1niv3vjk31x1gwcgefy'
      },
      {
        text: 'Hulk Hogan.',
        packId: 'base-pack',
        id: 'ofhw8wr3oe5e7sgs3pwmcng9'
      },
      {
        text: 'Acidentes de caça.',
        packId: 'base-pack',
        id: 'mhv2zgw3gdi1s9cxsfy5vuib'
      },
      {
        text: 'Acidentes de caça.',
        packId: 'base-pack',
        id: 'cmmqvzjbqc9d5hc1zkj4tvqh'
      },
      {
        text: 'Arremessar o corpo morro abaixo em busca de um queijo.',
        packId: 'base-pack',
        id: 'ax270rq7bhpghj5trbltjpw3'
      },
      {
        text: 'Furacão Katrina.',
        packId: 'base-pack',
        id: 't47adhhdgt8ces2y0h95xwbo'
      },
      {
        text: 'Ferir aqueles que estão mais próximos de mim.',
        packId: 'base-pack',
        id: 'rdzaqwykf1um2qvu37i16970'
      },
      {
        text: 'Sou amigo do seu pai no Facebook.',
        packId: 'base-pack',
        id: 's6tvlahvqtvdp3hsnh9z3k7h'
      },
      { text: 'Gelo.', packId: 'base-pack', id: 'dh0w5pt8pgmzh7wupt41tplj' },
      {
        text: 'Imigrantes ilegais.',
        packId: 'base-pack',
        id: 'r18ymgfyu9c45t26tipfnzrg'
      },
      {
        text: 'Impotência.',
        packId: 'base-pack',
        id: 'ml4x2y9g3nerr1lu1ouojovq'
      },
      {
        text: 'Dispositivos explosivos improvisados.',
        packId: 'base-pack',
        id: 'ynj7cdkqjq8thutlhkasx9yg'
      },
      {
        text: 'Iodelagem inapropriada.',
        packId: 'base-pack',
        id: 'bw7dvk45ocit4eayt75316dm'
      },
      { text: 'Incesto.', packId: 'base-pack', id: 'bvyxs6z63gttjusn4bjtqysu' },
      {
        text: 'Queimaduras indianas.',
        packId: 'base-pack',
        id: 'x763nrezewem60ylif2scujq'
      },
      {
        text: 'Inserindo um pote de geleia no meu ânus.',
        packId: 'base-pack',
        id: 'stterih14z6efnlmq3lv1apg'
      },
      {
        text: 'Inserindo um pote de vidro na minha região anal.',
        packId: 'base-pack',
        id: 'tt6gtmprw47h652jbadz42bn'
      },
      {
        text: 'Design inteligente.',
        packId: 'base-pack',
        id: 'pst0mc882j87bzunge5y1as6'
      },
      {
        text: 'Sonhos intoleravelmente vívidos.',
        packId: 'base-pack',
        id: 'akqnad3jkemrh5hh2zyub155'
      },
      {
        text: 'Invasão da Polônia.',
        packId: 'base-pack',
        id: 'y8jm6rr0cj89eefkgepeqog6'
      },
      {
        text: 'Síndrome do intestino irritável.',
        packId: 'base-pack',
        id: 'c1znlb2cpir26ultr51akfqp'
      },
      {
        text: 'Italianos.',
        packId: 'base-pack',
        id: 'td0vxreu7d6om7yotr3ukeh2'
      },
      {
        text: 'Buceta coçando.',
        packId: 'base-pack',
        id: 'cy6w5xnx0ms6zkfi3g3zcvj5'
      },
      {
        text: 'J.D. Power e seus associados.',
        packId: 'base-pack',
        id: 'rmhfr1mig2prppbc9qx50rh2'
      },
      {
        text: 'Os restos cancerígenos de Jade Goody.',
        packId: 'base-pack',
        id: 'yk6w0iphw8ujyxg8gjea6eff'
      },
      { text: 'Jedward.', packId: 'base-pack', id: 'yen3lfy5y6ogogmg8ix49563' },
      {
        text: 'Testemunhas de Jeová.',
        packId: 'base-pack',
        id: 'ksqys3ia87em5y7ucl56c59e'
      },
      {
        text: 'Jennifer Lawrence.',
        packId: 'base-pack',
        id: 'gdz45hsu3s3dfu6fwo3j9qvb'
      },
      {
        text: 'Se masturbando em uma piscina de lágrimas de crianças.',
        packId: 'base-pack',
        id: 'l21gsinifsuyh2dzjc7bluvj'
      },
      { text: 'Jesus.', packId: 'base-pack', id: 'g6y3xi0bixgj3mvbj1x66mx5' },
      {
        text: 'Judeus com cabelos encaracolados.',
        packId: 'base-pack',
        id: 'bz0hcjt8987kg06eb6ae3gpb'
      },
      {
        text: 'Fraternidades judaicas.',
        packId: 'base-pack',
        id: 't82zri5ua20l45apn0vqeyh3'
      },
      {
        text: 'Judeus, ciganos e homossexuais.',
        packId: 'base-pack',
        id: 'dvqusq0dh8x4dm4kvof0vbuz'
      },
      {
        text: 'Tagarelice sem sentido.',
        packId: 'base-pack',
        id: 'y4yoxbbawjaym00nb3j579b7'
      },
      {
        text: 'Jimmy Savile.',
        packId: 'base-pack',
        id: 'znah1550m9wqlsdqvdjbop0f'
      },
      {
        text: 'Empregos.',
        packId: 'base-pack',
        id: 'evt842ujvb4zum1vxmgguwp9'
      },
      {
        text: 'Joe Biden.',
        packId: 'base-pack',
        id: 'cc475qwkfcth3ebegtl5lvqd'
      },
      {
        text: 'Sobrancelhas de John Howard.',
        packId: 'base-pack',
        id: 'plpv3fd9ha9u27c0792r0mwj'
      },
      {
        text: 'John Wilkes Booth.',
        packId: 'base-pack',
        id: 'c7zvb88lm394wyqjtsnert36'
      },
      {
        text: 'Juíza Judy.',
        packId: 'base-pack',
        id: 'keetifs76ya1lybqgvzbxzd0'
      },
      {
        text: 'Julgar todos.',
        packId: 'base-pack',
        id: 'mnoe401w8g4zf5wua2o3zhw9'
      },
      {
        text: 'Apenas tocando o cabelo de David Beckham.',
        packId: 'base-pack',
        id: 'ngscu95tegvc4dul48ig36ln'
      },
      {
        text: 'Lanchonete favorita de Justin Bieber.',
        packId: 'base-pack',
        id: 'a2hueeyq697knnmb9uthxe1k'
      },
      {
        text: 'Justin Trudeau.',
        packId: 'base-pack',
        id: 'aaqos641d8ieqhid9wtwb07h'
      },
      { text: 'Juuling.', packId: 'base-pack', id: 'rymkctr9cj2g8t5bmxbazikm' },
      {
        text: 'Pilotos kamikazes.',
        packId: 'base-pack',
        id: 'od29z48pnfzhpkskay7cnxm6'
      },
      {
        text: 'Kanye West.',
        packId: 'base-pack',
        id: 'flwt3xhmrrgjd1fmt7c8sz3t'
      },
      {
        text: 'Keanu Reeves.',
        packId: 'base-pack',
        id: 'r8tycohzw7772ptuvchwe5nz'
      },
      {
        text: 'Mantendo Cristo no Natal.',
        packId: 'base-pack',
        id: 'deor5t61sibvd5fd78ilvdp5'
      },
      {
        text: 'Bolas de Kegel.',
        packId: 'base-pack',
        id: 'y9xfpm9a8g9a4eqpiiextefz'
      },
      {
        text: "Kibbles 'n Bits™.",
        packId: 'base-pack',
        id: 'sp0fp0gjsllkxmttpjowq2sf'
      },
      {
        text: "Kibbles n' Bits.",
        packId: 'base-pack',
        id: 'uj29z41cdp96xsvo2n0p65t1'
      },
      {
        text: 'Crianças com câncer no traseiro.',
        packId: 'base-pack',
        id: 'xcds9npwhpvkdexxvylx8h0r'
      },
      {
        text: 'Crianças com câncer no bumbum.',
        packId: 'base-pack',
        id: 'n2x752rpzbw35wpfsmwkpbt0'
      },
      {
        text: 'Kim Jong-il.',
        packId: 'base-pack',
        id: 'uz9vyppmqtn55hxzde3nfc6r'
      },
      {
        text: 'Kim Jong-un.',
        packId: 'base-pack',
        id: 'xujzn3qjwqno36fgn4t485qr'
      },
      {
        text: 'Beijando a avó na testa e desligando o suporte de vida dela.',
        packId: 'base-pack',
        id: 'e8j1ejnufedykgo9orluv3kq'
      },
      {
        text: 'Beijando a avó na testa e desligando o suporte de vida dela.',
        packId: 'base-pack',
        id: 'ru0z49myxf0revrziy90n0fz'
      },
      {
        text: 'Crime de faca.',
        packId: 'base-pack',
        id: 'fg1xgo6k7fpmlz38i3kseemp'
      },
      {
        text: 'Kourtney, Kim, Khloe, Kendall e Kylie.',
        packId: 'base-pack',
        id: 'ojkfezae6157bx1v1tavsbsu'
      },
      {
        text: 'Senhoras, senhores e os indecisos.',
        packId: 'base-pack',
        id: 'uq9m3s9q0ib5abu9eh6ar4nt'
      },
      { text: 'Rapazes.', packId: 'base-pack', id: 's8au24iavssyu6scc161061c' },
      {
        text: 'Lady Gaga.',
        packId: 'base-pack',
        id: 'a68sma1zh0pbm9wwixfxwn02'
      },
      {
        text: 'O testículo perdido de Lance Armstrong.',
        packId: 'base-pack',
        id: 'ozjmupgfx1jeazllyqifrth5'
      },
      {
        text: 'Minas terrestres.',
        packId: 'base-pack',
        id: 'b7gaken0n3to2xzlpxjulc1w'
      },
      {
        text: 'Botar um ovo.',
        packId: 'base-pack',
        id: 'a7d92bp9unrkz3njoj8h1sn2'
      },
      {
        text: 'Vídeo vazado da colonoscopia de Kate Middleton.',
        packId: 'base-pack',
        id: 'ub8h5mizb90y9e07b5qsn8ye'
      },
      {
        text: 'Deixar uma mensagem de voz constrangedora.',
        packId: 'base-pack',
        id: 'wjx0cbsmqged4ib2ycwlt0q3'
      },
      {
        text: 'Lena Dunham.',
        packId: 'base-pack',
        id: 'y44miglxit69t9g317ooldn4'
      },
      {
        text: 'Hanseníase.',
        packId: 'base-pack',
        id: 'drt24q99gpt9phr6cdoruql9'
      },
      {
        text: 'Deixar Gemma Collins esguichar em seu rosto.',
        packId: 'base-pack',
        id: 'jk7vpku7eu2lhozdetzo5nke'
      },
      {
        text: 'Deixar-se ir.',
        packId: 'base-pack',
        id: 'sek1smd58f06fl2wgoehzevb'
      },
      {
        text: 'Subir de nível.',
        packId: 'base-pack',
        id: 'p9n54ybcw3kybvnoysa4qpil'
      },
      {
        text: 'Liberais.',
        packId: 'base-pack',
        id: 'ljkxxomirr9uvyt58ns7hol6'
      },
      {
        text: 'Lamber coisas para reivindicá-las como suas.',
        packId: 'base-pack',
        id: 'cbto3t0sgm44em9tw7tfehmf'
      },
      {
        text: 'Ouvir seus problemas sem tentar resolvê-los.',
        packId: 'base-pack',
        id: 'ugomp5kave6tuttats2jljhg'
      },
      {
        text: 'Literalmente comer merda.',
        packId: 'base-pack',
        id: 'q463m04316jbvdjor1hy1x9r'
      },
      {
        text: 'Pênis de menino pequeno.',
        packId: 'base-pack',
        id: 'hskwuv9ngptese6ykuqzo6qm'
      },
      {
        text: 'Viver em uma lata de lixo.',
        packId: 'base-pack',
        id: 'tlx5uaagsx0b31ng0cs49x7k'
      },
      {
        text: 'Viver em Yellowknife.',
        packId: 'base-pack',
        id: 'ugpdzdtw767xuvrjg9e4gqcd'
      },
      { text: 'Tétano.', packId: 'base-pack', id: 'ry6tngdg632ig6gnizq7g5jk' },
      {
        text: 'Procurando o esconderijo pornô do seu pai.',
        packId: 'base-pack',
        id: 'e5qovch44abirw7axlgza2ld'
      },
      {
        text: 'Olhar no espelho, aplicar batom e sussurrar "hoje à noite, você vai transar com Tom Cruise".',
        packId: 'base-pack',
        id: 'ph55vr18mcgt77e8j42k7jd6'
      },
      {
        text: 'Lábios soltos.',
        packId: 'base-pack',
        id: 'nnxarl0obcwqlz8yox94l58z'
      },
      {
        text: 'Fantasias de lenhador.',
        packId: 'base-pack',
        id: 'dil8a58z66rvqaljuze0muly'
      },
      {
        text: 'Lunchables™.',
        packId: 'base-pack',
        id: 'dma8ev54bunvjrn829takqum'
      },
      {
        text: 'LYNX® Body Spray.',
        packId: 'base-pack',
        id: 'pwaigxtiqcnzjqlnsmof2gl5'
      },
      {
        text: 'Doença da vaca louca.',
        packId: 'base-pack',
        id: 'wfjhla8b6xlu867wod4pyrm7'
      },
      {
        text: 'Madeleine McCann.',
        packId: 'base-pack',
        id: 'xnwj3x4i42ykp2fgbd6az9sw'
      },
      { text: 'Ímãs.', packId: 'base-pack', id: 'mk37goc0e6h8vysjewf6ekmc' },
      {
        text: 'Fazendo uma lista de pessoas para matar.',
        packId: 'base-pack',
        id: 'c51thg7nstwpstiegugvmwpf'
      },
      {
        text: 'Fazendo um biquinho.',
        packId: 'base-pack',
        id: 'c7v1spuhz43aqfv8g3wczi07'
      },
      {
        text: 'Fazendo sexo com ela.',
        packId: 'base-pack',
        id: 'i2efweo6ruwbehjl3nbw0mo0'
      },
      {
        text: 'Fazendo os pênis se beijarem.',
        packId: 'base-pack',
        id: 'zcqovbyjug57wnyzdiv6f867'
      },
      {
        text: 'Compensando séculos de opressão com um dia de desculpas.',
        packId: 'base-pack',
        id: 'pyqov6iu46k95wgieqqurpt6'
      },
      {
        text: 'Carne de homem.',
        packId: 'base-pack',
        id: 'jz1f4j0xjydnavx1css5q1en'
      },
      {
        text: 'Mansplaining.',
        packId: 'base-pack',
        id: 'gp8khy3ievrq4n62h55xyhva'
      },
      {
        text: 'Muitos morcegos.',
        packId: 'base-pack',
        id: 'sh3x6wckn6j66owvs5fhaulj'
      },
      {
        text: 'Marky Mark e o Funky Bunch.',
        packId: 'base-pack',
        id: 'pmq0mto4z3mx4y7umwfofi5a'
      },
      {
        text: 'Vagina dourada de Martha Stewart.',
        packId: 'base-pack',
        id: 'h8bl3otk8jznge6mjwhvurp5'
      },
      {
        text: 'Seca maciça e generalizada.',
        packId: 'base-pack',
        id: 'fzwdlenbp4zfidhdsruuxg84'
      },
      {
        text: 'Masturbando-se.',
        packId: 'base-pack',
        id: 'mbrwa5y3im40ai6i69sjidgo'
      },
      {
        text: 'Masturbação.',
        packId: 'base-pack',
        id: 'v5iuz97w2p0rwvg0fao9m37y'
      },
      {
        text: 'Atletas de matemática.',
        packId: 'base-pack',
        id: 'zy6lfmfftlhlsovvugn8i4tu'
      },
      {
        text: 'Maureen de Blackpool, Esposa do Leitor do Ano de 1988.',
        packId: 'base-pack',
        id: 'scrmc1sji4dko5425txrifb2'
      },
      {
        text: 'Tempo para mim.',
        packId: 'base-pack',
        id: 'axcbgikrbcbdrfr051lcre3g'
      },
      {
        text: 'Pessoas maldosas.',
        packId: 'base-pack',
        id: 'wmn460zq5vb6b9q57buhvj4z'
      },
      {
        text: 'MechaHitler.',
        packId: 'base-pack',
        id: 'gz02pg8v91gfnp071zs7p6aa'
      },
      { text: 'Memes.', packId: 'base-pack', id: 'twjmfkvwctz29qwvj09gl59p' },
      {
        text: 'Homens discutindo seus sentimentos de forma emocionalmente saudável.',
        packId: 'base-pack',
        id: 'eive2s7rahtsmjbug84wrc5o'
      },
      { text: 'Homens.', packId: 'base-pack', id: 'xkdtqhgse4tl0m29gez7zf3p' },
      {
        text: 'Raiva menstrual.',
        packId: 'base-pack',
        id: 'nor1io65x7fniraxj82gj3wo'
      },
      {
        text: 'Pornografia menstrual.',
        packId: 'base-pack',
        id: 'ccykl0bjrkhjqkxb42iapgsx'
      },
      {
        text: 'Metanfetamina.',
        packId: 'base-pack',
        id: 'wm1bil0k9thu7gdxrdagwece'
      },
      {
        text: 'Michael Jackson.',
        packId: 'base-pack',
        id: 't5mzg926d8llnciwslgezgaf'
      },
      {
        text: 'Braços de Michelle Obama.',
        packId: 'base-pack',
        id: 'jch4srr1yb77dgmitdkpltsz'
      },
      {
        text: 'Mike Pence.',
        packId: 'base-pack',
        id: 'ge3v4xcdoj2yvq7ycwhoksui'
      },
      {
        text: 'Racismo leve e homofobia extrema.',
        packId: 'base-pack',
        id: 'b3ttixjlq6kynl8aecqtcpip'
      },
      {
        text: 'Miley Cyrus aos 55 anos.',
        packId: 'base-pack',
        id: 'u6yfcn31grw1vpl0lhy8zt61'
      },
      {
        text: 'Miley Cyrus.',
        packId: 'base-pack',
        id: 'qou27joqui10f3d06905zgbh'
      },
      {
        text: 'Milhões de sapos-cururu.',
        packId: 'base-pack',
        id: 'nym78e0t11ae6bam16e73gom'
      },
      {
        text: 'Torcedores do Millwall.',
        packId: 'base-pack',
        id: 'ba3kgxd5amrevhvifvx6qbsy'
      },
      {
        text: 'Acidentes de mineração.',
        packId: 'base-pack',
        id: 'u7kwfol0br200z8u2weqmr0e'
      },
      {
        text: 'Confundir uma pessoa com deficiência mental com alguém que é apenas surdo.',
        packId: 'base-pack',
        id: 'jk9wtpr7rrm21apb8ii42wcj'
      },
      { text: 'Mamãe.', packId: 'base-pack', id: 'e099duy28js0qn3axjno4qdd' },
      {
        text: 'Lua para um Primeiro-Ministro.',
        packId: 'base-pack',
        id: 'h1r65mbthshsv1mw3laose16'
      },
      {
        text: 'Ambiguidade moral.',
        packId: 'base-pack',
        id: 'aporn016ajwu1zp9pvdskmqe'
      },
      {
        text: 'Mais pênis de elefante do que eu esperava.',
        packId: 'base-pack',
        id: 'kv9c6chrfkgpscxoyo9yk0am'
      },
      {
        text: 'A voz de Morgan Freeman.',
        packId: 'base-pack',
        id: 'gnypd3glpipcutnklowvksas'
      },
      {
        text: 'Mountain Dew Code Red.',
        packId: 'base-pack',
        id: 'yi90gmynm340vvls9kvkqmq7'
      },
      {
        text: 'Herpes bucal.',
        packId: 'base-pack',
        id: 'mjipgqh0cluoid6ri1ojtczo'
      },
      {
        text: 'Sr. Limpo, bem atrás de você.',
        packId: 'base-pack',
        id: 'kyr74j38djkbm3watsw4fqfa'
      },
      {
        text: 'Sr. Dressup.',
        packId: 'base-pack',
        id: 'pg175zppd486uponvpb74x8o'
      },
      {
        text: 'O anel do Sr. Froto.',
        packId: 'base-pack',
        id: 't678xidmsi8griak6ndn2wnj'
      },
      {
        text: 'Sr. Snuffleupagus.',
        packId: 'base-pack',
        id: 'anecem0o87ogmx51kuhhchbz'
      },
      {
        text: 'Sr. Squiggle, o Homem da Lua.',
        packId: 'base-pack',
        id: 's5iwqm7xl3v569ypnzo7xd5s'
      },
      {
        text: 'Maomé (A Paz Esteja Com Ele).',
        packId: 'base-pack',
        id: 'w77i0dndowjkonfjcmox75pv'
      },
      {
        text: 'Maomé (Louvado Seja Ele).',
        packId: 'base-pack',
        id: 'qtjcnym5pgyyh40bjpuf2tb2'
      },
      {
        text: 'Transtorno de personalidade múltipla.',
        packId: 'base-pack',
        id: 'b448g3z07ziku3fl5z95iqc9'
      },
      {
        text: 'Múltiplos ferimentos a faca.',
        packId: 'base-pack',
        id: 'vamzdhdgpc758imf6ure0so5'
      },
      {
        text: 'Assassinando nossos pais.',
        packId: 'base-pack',
        id: 'uofvn04be95toypo6z3jp80p'
      },
      {
        text: 'Destruição mútua assegurada.',
        packId: 'base-pack',
        id: 'hh2koz750yv2nfk3ups3uuo9'
      },
      {
        text: 'Destruição mutuamente assegurada.',
        packId: 'base-pack',
        id: 'thoquk7b6zbsic2w6upd2pt4'
      },
      { text: 'Muzzy.', packId: 'base-pack', id: 's1j0mcsedxo5fqzvx65k115g' },
      {
        text: 'Meu namorado abusivo que na verdade não é tão ruim quando você o conhece.',
        packId: 'base-pack',
        id: 'rqy4ghclqiw3vy3zthd8ybpz'
      },
      {
        text: 'Meus testículos no seu rosto.',
        packId: 'base-pack',
        id: 'vshrea80zlo6mq4rjkjk86pj'
      },
      {
        text: 'Meu traseiro negro.',
        packId: 'base-pack',
        id: 'b7loht9eaxaaa07abreh0fuq'
      },
      {
        text: 'Minha buceta rosa brilhante.',
        packId: 'base-pack',
        id: 'r19g57dec2rdqegtv9p4mlgz'
      },
      {
        text: 'Meu marido traidor filho da mãe.',
        packId: 'base-pack',
        id: 'etkzkb2nlw81c790az01y33j'
      },
      {
        text: 'Minha coleção de brinquedos sexuais de alta tecnologia.',
        packId: 'base-pack',
        id: 'laa05ih4i6rjn5lox2jeg5ft'
      },
      {
        text: 'Minha coleção de brinquedos sexuais japoneses.',
        packId: 'base-pack',
        id: 'm74xcucdwgsidsxw1nls5st8'
      },
      {
        text: 'Minha ex-esposa.',
        packId: 'base-pack',
        id: 'aa9d1zdb5599w3hjcj672zua'
      },
      {
        text: 'Minha filha gorda.',
        packId: 'base-pack',
        id: 'moi3odr519215j7v89jf83ni'
      },
      {
        text: 'Meu pai, que morreu quando eu tinha sete anos.',
        packId: 'base-pack',
        id: 'a4s24yk5qu8m31w5fijvjcid'
      },
      {
        text: 'Meu primeiro beijo.',
        packId: 'base-pack',
        id: 'm1f00sw2soh1o2sjme7jn962'
      },
      {
        text: 'Meus genitais.',
        packId: 'base-pack',
        id: 'wh29syhxp7cbji2emjbc8mlb'
      },
      {
        text: 'Meu bom sutiã.',
        packId: 'base-pack',
        id: 'mhj46jciw5hzd0qt7kis9wr0'
      },
      {
        text: 'Minhas corcovas.',
        packId: 'base-pack',
        id: 'lzo0vqzs6c437fnbmy4j6qsa'
      },
      {
        text: 'Meus demônios internos.',
        packId: 'base-pack',
        id: 'g41ag272fnz30d56wr34y8oz'
      },
      {
        text: 'Meu pintinho.',
        packId: 'base-pack',
        id: 'd9y03cys688dp41qmsy4dkor'
      },
      {
        text: 'Minha faca de mato.',
        packId: 'base-pack',
        id: 'o67dviuz7j3y1mpdxr1ujczd'
      },
      {
        text: 'Meu amigo Dave.',
        packId: 'base-pack',
        id: 'qmg2gredb1px6ykkhgue8d9q'
      },
      {
        text: 'Meu pescoço, minha lombar, minha buceta e minha rachadura.',
        packId: 'base-pack',
        id: 'b019665bj972dd89fm66b5a2'
      },
      {
        text: 'Meu status de relacionamento.',
        packId: 'base-pack',
        id: 'nk6g53wsjzyfb9llso2dfver'
      },
      {
        text: 'Minha vida sexual.',
        packId: 'base-pack',
        id: 'llcrrm44axngfvp5jmpcs2h4'
      },
      {
        text: 'Minha alma.',
        packId: 'base-pack',
        id: 'vr71vkjdnio4rvywl2tjzjae'
      },
      {
        text: 'Meu motorista do Uber, Pavel.',
        packId: 'base-pack',
        id: 'ug5gtew93t6no9x4rkjnwlmy'
      },
      {
        text: 'Meu rosto feio e minha personalidade ruim.',
        packId: 'base-pack',
        id: 'ihl3wdnjeeobo9hqqe65mm22'
      },
      {
        text: 'Minha coleção de bonés de caminhoneiro vintage.',
        packId: 'base-pack',
        id: 'a6au53zmas1h3sllsj8m8di7'
      },
      {
        text: 'Nachos para a mesa.',
        packId: 'base-pack',
        id: 'kggkvesqr9kqbbzreo5lrxnf'
      },
      {
        text: 'Naked News.',
        packId: 'base-pack',
        id: 'tw6yrph9jltmg68bge6zvxks'
      },
      {
        text: 'Natalie Portman.',
        packId: 'base-pack',
        id: 'se8p8y2qku7wha29l3tpakoo'
      },
      {
        text: 'Aprimoramento natural masculino.',
        packId: 'base-pack',
        id: 'bwfmsqf8fbtd778xhbl37f7p'
      },
      {
        text: 'Seleção natural.',
        packId: 'base-pack',
        id: 'jlnaps8n7aqpd79r0o1l3nsf'
      },
      {
        text: 'Nazistas.',
        packId: 'base-pack',
        id: 'o0kyqhxgm5xfi97xzaxbma2w'
      },
      {
        text: 'Superestrela da NBA LeBron James.',
        packId: 'base-pack',
        id: 'zpx10vyyj83u62ryfm7ks0co'
      },
      {
        text: 'Necrofilia.',
        packId: 'base-pack',
        id: 'uzx4pl4alwcbti53k30r9hlp'
      },
      {
        text: 'Música New Age.',
        packId: 'base-pack',
        id: 'bh10x9ak6vuwkmzsd046qrn0'
      },
      { text: 'Newfies.', packId: 'base-pack', id: 'j9npcrxbdfsze5n6jhpn6ut4' },
      {
        text: 'Táticas kamikaze recém-incorporadas.',
        packId: 'base-pack',
        id: 'b9z4sd96jk4jstyozyt7a3io'
      },
      {
        text: 'Nickelback.',
        packId: 'base-pack',
        id: 'bpa6ouxvsldyi3s8llzo2olh'
      },
      {
        text: 'Nicolas Cage.',
        packId: 'base-pack',
        id: 'fboize3atit3xek6ru3va1c8'
      },
      {
        text: 'Deslizes de mamilo.',
        packId: 'base-pack',
        id: 'hf1dsvnmloc1d4il0xpbt6dl'
      },
      {
        text: 'Crianças pequenas.',
        packId: 'base-pack',
        id: 'opzcg8eld5uak1b31wgrg004'
      },
      {
        text: 'Lâminas de mamilo.',
        packId: 'base-pack',
        id: 'd3ccdmogd1kcdoy052ka4ogi'
      },
      {
        text: 'Emissões noturnas.',
        packId: 'base-pack',
        id: 'qapad0zxrglj99vbuxx1gmd8'
      },
      {
        text: 'Não cobrir a boca quando espirra.',
        packId: 'base-pack',
        id: 'ql0zzn5ajmw9g911f9wvv2mi'
      },
      {
        text: 'Não dar a mínima para o Terceiro Mundo.',
        packId: 'base-pack',
        id: 'r6s9ta5r5xz19ub03352oawy'
      },
      {
        text: 'Não ter conversas tolas.',
        packId: 'base-pack',
        id: 'kgi8vgltx77oxidnxsg3vc9k'
      },
      {
        text: 'Não retribuir sexo oral.',
        packId: 'base-pack',
        id: 'j9wehrxj6lbwyp31nxh0je65'
      },
      {
        text: 'Não vacinar meus filhos porque sou estúpido.',
        packId: 'base-pack',
        id: 'fvjldresygaes1nr1c3lu9kl'
      },
      {
        text: 'Não usar calças.',
        packId: 'base-pack',
        id: 'lr2mod80idv1e4bqkelo5cdu'
      },
      {
        text: 'Nada além de areia.',
        packId: 'base-pack',
        id: 'k1twc9zmw9j4n8d5vza77uky'
      },
      {
        text: 'Nada. Absolutamente nada.',
        packId: 'base-pack',
        id: 'vipkmovbka5acbavj7tlws0c'
      },
      {
        text: 'Nunchakus.',
        packId: 'base-pack',
        id: 'tqd1whlvwkx68fm7bvxbfbdt'
      },
      {
        text: 'Obesidade.',
        packId: 'base-pack',
        id: 'cvosaluuipgjh3eg69o9en4u'
      },
      {
        text: 'Permanência de objeto.',
        packId: 'base-pack',
        id: 'po0bdbc877wmfb3d2jx2zwsp'
      },
      {
        text: 'Estrogênio.',
        packId: 'base-pack',
        id: 'grhimgxdf7iyehmi0caac8ts'
      },
      {
        text: 'Cheiro de idosos.',
        packId: 'base-pack',
        id: 'i8g0wwla47owcb497px8f5jd'
      },
      {
        text: 'Música de fundo ominosa.',
        packId: 'base-pack',
        id: 'wdnj63bkn5c3x2qx1mehvg44'
      },
      {
        text: 'Corpos macios e sem pelos do One Direction.',
        packId: 'base-pack',
        id: 'ho1zw9awnydhhf3u9hx8d4w6'
      },
      {
        text: 'Um filho da puta grosseiro.',
        packId: 'base-pack',
        id: 'xmbsfbnysrdz0jkqsz4qn5cy'
      },
      {
        text: 'Um seio de fora.',
        packId: 'base-pack',
        id: 'copd7b64lp9l4ine51ulrnfh'
      },
      {
        text: 'Um trilhão de dólares.',
        packId: 'base-pack',
        id: 's1j6bbucrn1pnioim7vgxhnb'
      },
      {
        text: 'Só namorar mulheres asiáticas.',
        packId: 'base-pack',
        id: 'tomtl6shfj63az0oegab3wkc'
      },
      {
        text: 'Oompa-Loompas.',
        packId: 'base-pack',
        id: 'j8ddcaycmxvmojctjwbyytai'
      },
      {
        text: 'Polegares opositores.',
        packId: 'base-pack',
        id: 'wo6xtga8tk61fzeux4uyzxnk'
      },
      {
        text: 'Optimus Prime fazendo sexo com uma máquina de lavar louça.',
        packId: 'base-pack',
        id: 'c1ftu1j8pw5yqf7gsihh6ph0'
      },
      {
        text: 'Nosso primeiro Presidente chimpanzé.',
        packId: 'base-pack',
        id: 'qmo38j236z0g96934ffxmlee'
      },
      {
        text: 'Nosso primeiro Primeiro-Ministro chimpanzé.',
        packId: 'base-pack',
        id: 'p5l35p5s1uth3ci74sij4cy5'
      },
      {
        text: 'Supercompensação.',
        packId: 'base-pack',
        id: 'hr2psvrusp5b0t8rtcysgb58'
      },
      {
        text: 'Dominando o seu pai.',
        packId: 'base-pack',
        id: 'qfd1hosrj1i9xrs3y5a6otrp'
      },
      {
        text: 'Pirulitos gigantes.',
        packId: 'base-pack',
        id: 'fktajqlqvjmsz4hey85wu19y'
      },
      {
        text: "Possuir e operar uma franquia Chili's.",
        packId: 'base-pack',
        id: 'vbrz10gxi6ya92s0xpuyvan8'
      },
      {
        text: 'Pabst Blue Ribbon.',
        packId: 'base-pack',
        id: 'lv33wqya6ee2x17kac55vb3x'
      },
      {
        text: 'Pac-Man engolindo esperma descontroladamente.',
        packId: 'base-pack',
        id: 'xr6vad1lz3qocw580umddo2u'
      },
      {
        text: 'Pedófilos.',
        packId: 'base-pack',
        id: 'sjvp5r6wy6i6udfxmdsamwau'
      },
      {
        text: 'Sexo de pandas.',
        packId: 'base-pack',
        id: 'aqo6ps7upd1jeej8x1eau4c6'
      },
      {
        text: 'Paris Hilton.',
        packId: 'base-pack',
        id: 'ho9zvxh7mmqxhapynpek7rrp'
      },
      {
        text: 'Separar o Mar Vermelho.',
        packId: 'base-pack',
        id: 'qo3eht1k966eu9otnx0tmpge'
      },
      {
        text: 'Estraga-festas.',
        packId: 'base-pack',
        id: 'z2p4jyzxakr8jt4a51n2bfqe'
      },
      {
        text: 'Travestis passáveis.',
        packId: 'base-pack',
        id: 'qo1tqsto82yxw7s8vpfbyg8u'
      },
      {
        text: 'Passar uma pedra nos rins.',
        packId: 'base-pack',
        id: 'uqxsz41j0v2t2cdcfgb5my4q'
      },
      {
        text: 'Passivo-agressão.',
        packId: 'base-pack',
        id: 'd9ocy4utbacktwp3ly7ljbg0'
      },
      {
        text: 'Anotações passivo-agressivas em Post-it.',
        packId: 'base-pack',
        id: 'mlj2fgrcyyy81ndf7hwv8lg8'
      },
      {
        text: 'Pauline Hanson.',
        packId: 'base-pack',
        id: 'mxh2ck68r6uyxks3j5swprj4'
      },
      {
        text: 'PCP (Fenciclidina).',
        packId: 'base-pack',
        id: 'w6fwnlxyk89b5niagwu1zrk9'
      },
      {
        text: 'Tempo da manteiga de amendoim e geleia.',
        packId: 'base-pack',
        id: 'yrxmv5otkojbpi8bu5saz9jo'
      },
      {
        text: 'Pedófilos.',
        packId: 'base-pack',
        id: 'kjd5f48xty7gfeiif8k6lz7n'
      },
      {
        text: 'Urinando um pouquinho.',
        packId: 'base-pack',
        id: 's5ar6yq61dyo9cpinol83t8k'
      },
      {
        text: 'Bafo de pênis.',
        packId: 'base-pack',
        id: 'llqw4tichs20msledf7ayy5m'
      },
      {
        text: 'Inveja de pênis.',
        packId: 'base-pack',
        id: 'swb07bp1hga8icy2ula89pcs'
      },
      {
        text: 'Pessoas que cheiram suas próprias meias.',
        packId: 'base-pack',
        id: 'yrcusk5hmpz5peo1u5v1mw7k'
      },
      {
        text: 'Carícias preliminares perfunctórias.',
        packId: 'base-pack',
        id: 'a08t81pee3a5vppz2p2f4hhd'
      },
      {
        text: 'Transtorno de Rosto de Orgasmo Permanente.',
        packId: 'base-pack',
        id: 'a8rcxfzncvy1v6oingttkhtz'
      },
      {
        text: 'Conquistando garotas na clínica de aborto.',
        packId: 'base-pack',
        id: 'a9aqje2cciza86j2hsjqcizr'
      },
      {
        text: 'Fotos de seios.',
        packId: 'base-pack',
        id: 'it5yyoxtomqpgo30jdti2xpp'
      },
      { text: 'Ciganos.', packId: 'base-pack', id: 'stv6v7944wrmoxcosmummv69' },
      {
        text: 'Pingers (pílulas de ecstasy).',
        packId: 'base-pack',
        id: 'qmk693f5tzl5k4oei2hd6aka'
      },
      {
        text: 'Bukkake pixelado.',
        packId: 'base-pack',
        id: 'xx0slldpgfpwpfm3vbd2m76e'
      },
      {
        text: 'Fazendo palhaçadas.',
        packId: 'base-pack',
        id: 'e2twup1l1job5bn9rfdlnu9m'
      },
      {
        text: 'Brutalidade policial.',
        packId: 'base-pack',
        id: 'swn1lc03c4vq24oxhtcvur0t'
      },
      {
        text: 'Pessoas polonesas.',
        packId: 'base-pack',
        id: 'v7f0ep77elfdbbvy4nr6fi3d'
      },
      {
        text: 'Defecando de um lado para o outro. Para sempre.',
        packId: 'base-pack',
        id: 'ex2pr30b9x1visyviomlim77'
      },
      {
        text: 'Defecando em um laptop e fechando-o.',
        packId: 'base-pack',
        id: 'p0aysvxwkrybwhp60c5p6md2'
      },
      {
        text: 'Defecando na sopa.',
        packId: 'base-pack',
        id: 'l3vw7pdggs14ansn54pvw2k7'
      },
      {
        text: 'Fraldas sujas.',
        packId: 'base-pack',
        id: 'xjr01mjisspnwkvc11g5zyzd'
      },
      {
        text: 'Escolhas de vida ruins.',
        packId: 'base-pack',
        id: 'zp5tgraa5qgixaymbaq440hf'
      },
      {
        text: 'Higiene pessoal precária.',
        packId: 'base-pack',
        id: 'xuss3x392bo0fyck0ecumnn2'
      },
      {
        text: 'Piadas sobre o Holocausto em má hora.',
        packId: 'base-pack',
        id: 'y7z69zhch7ez7lxr972twjcj'
      },
      {
        text: 'Golas levantadas.',
        packId: 'base-pack',
        id: 'zb0pgskzac9wvtvmlnnlphwl'
      },
      {
        text: 'Estrelas pornôs.',
        packId: 'base-pack',
        id: 'ulh93uyfz5jz7o4g0hlwou4w'
      },
      {
        text: 'Poutine (prato canadense).',
        packId: 'base-pack',
        id: 'vozw6mif65af4t1axxm859ll'
      },
      { text: 'Pobreza.', packId: 'base-pack', id: 'yx0g3o6o0bju9gocyiya3bfi' },
      {
        text: 'Alergias poderosas.',
        packId: 'base-pack',
        id: 'lx558xow5chk2acongzc3px7'
      },
      {
        text: 'Coxas poderosas.',
        packId: 'base-pack',
        id: 'dfduwd61v617mjajuv28g77n'
      },
      { text: 'Pulando.', packId: 'base-pack', id: 'k8l07l6lsjhz0o00l7b84hnc' },
      {
        text: 'Rezando para a homossexualidade desaparecer.',
        packId: 'base-pack',
        id: 'br4n2kzej2k226ln434xr5t5'
      },
      {
        text: 'Analgésicos prescritos.',
        packId: 'base-pack',
        id: 'b65s1lf5s43t7y7fbapsvlt1'
      },
      {
        text: 'Pré-adolescentes.',
        packId: 'base-pack',
        id: 'rjopfilbm58wmw4u3mpnuc3c'
      },
      {
        text: 'Fingindo se importar.',
        packId: 'base-pack',
        id: 'p9vgrtvqsq6svsxgunndpycm'
      },
      {
        text: 'Profundo respeito e apreciação pela cultura indígena.',
        packId: 'base-pack',
        id: 'oes98dyj4nllpvhovdscp1ny'
      },
      {
        text: 'Pronunciando os nomes das cidades galesas do norte.',
        packId: 'base-pack',
        id: 'kj5n4cbkqchn0k7wl748bqaj'
      },
      {
        text: 'Garotas de programa.',
        packId: 'base-pack',
        id: 'mg77mvwzc0lo7tz71eut21sw'
      },
      {
        text: 'Ovos de pterodáctilo.',
        packId: 'base-pack',
        id: 'kz9yyrwdizpzziubc6vuyk8m'
      },
      {
        text: 'TEPT (Transtorno de Estresse Pós-Traumático).',
        packId: 'base-pack',
        id: 'qppq1053apof2er7k8tkuvxs'
      },
      {
        text: 'Puberdade.',
        packId: 'base-pack',
        id: 'hqe5uxsobtul7nhak0mhzagh'
      },
      {
        text: 'Pabst Blue Ribbon.',
        packId: 'base-pack',
        id: 'qwry2qydye9ek3lexxtsejcp'
      },
      {
        text: 'Pac-Man engolindo esperma descontroladamente.',
        packId: 'base-pack',
        id: 'r1qf576czv6pkio4d2hyavol'
      },
      {
        text: 'Pedófilos.',
        packId: 'base-pack',
        id: 'ixoirnwhtso0lkcfunrmtouy'
      },
      {
        text: 'Sexo de pandas.',
        packId: 'base-pack',
        id: 'ne6gugmtpxy4yxpeds22rk5o'
      },
      {
        text: 'Paris Hilton.',
        packId: 'base-pack',
        id: 'acl15uaenacpqibpbtg0xwwl'
      },
      {
        text: 'Separar o Mar Vermelho.',
        packId: 'base-pack',
        id: 'qjw4ych2m61ggjttungfkhgl'
      },
      {
        text: 'Estraga-festas.',
        packId: 'base-pack',
        id: 'v4de5vail75cohtx3cog3wig'
      },
      {
        text: 'Travestis passáveis.',
        packId: 'base-pack',
        id: 'dcsavmvqqznccd1jlj8kc06x'
      },
      {
        text: 'Passar uma pedra nos rins.',
        packId: 'base-pack',
        id: 'eoodatqrdm27ei4fa7b0ayr8'
      },
      {
        text: 'Passivo-agressão.',
        packId: 'base-pack',
        id: 'azarxru2lchjv23ifvsk335w'
      },
      {
        text: 'Anotações passivo-agressivas em Post-it.',
        packId: 'base-pack',
        id: 'zuwif7ugj8rei1dymsfvnn81'
      },
      {
        text: 'Pauline Hanson.',
        packId: 'base-pack',
        id: 'x6sn5yvv4snd28sdxwsv11ww'
      },
      {
        text: 'PCP (Fenciclidina).',
        packId: 'base-pack',
        id: 's3ljyl271fcdnq7nldzc3zlc'
      },
      {
        text: 'Tempo da manteiga de amendoim e geleia.',
        packId: 'base-pack',
        id: 'hlk2s8dgkz6agpfamh02arx4'
      },
      {
        text: 'Pedófilos.',
        packId: 'base-pack',
        id: 'uxm54z43l6fgw9e8bnt2f8qt'
      },
      {
        text: 'Urinando um pouquinho.',
        packId: 'base-pack',
        id: 'qxn5nbnuow2c4ny9jnfa0qo8'
      },
      {
        text: 'Bafo de pênis.',
        packId: 'base-pack',
        id: 'v39sovam713gerdik6epxstx'
      },
      {
        text: 'Inveja de pênis.',
        packId: 'base-pack',
        id: 'w7f1ewg3immkqtfh4hlqoulq'
      },
      {
        text: 'Pessoas que cheiram suas próprias meias.',
        packId: 'base-pack',
        id: 'q46zplyurnl2kbvail3jem0v'
      },
      {
        text: 'Carícias preliminares perfunctórias.',
        packId: 'base-pack',
        id: 'u6g8683m1rbsd14wqryi427t'
      },
      {
        text: 'Transtorno de Rosto de Orgasmo Permanente.',
        packId: 'base-pack',
        id: 'rqfdn2fhtcx9pod5jrtz1jhy'
      },
      {
        text: 'Conquistando garotas na clínica de aborto.',
        packId: 'base-pack',
        id: 'yoc4hxg0mk32hfv2t3s4l6ca'
      },
      {
        text: 'Fotos de seios.',
        packId: 'base-pack',
        id: 'z338rf7sc3box10jrl347j3f'
      },
      { text: 'Ciganos.', packId: 'base-pack', id: 'zj78pyoovmttyck37zv7j9dh' },
      {
        text: 'Pingers (pílulas de ecstasy).',
        packId: 'base-pack',
        id: 'w1hl4vpng9v11jnnjr4z5avt'
      },
      {
        text: 'Bukkake pixelado.',
        packId: 'base-pack',
        id: 'cx6q22oop8pa8t2vfymslyhx'
      },
      {
        text: 'Fazendo palhaçadas.',
        packId: 'base-pack',
        id: 'aa68req8nzad3f9yn4ov7ou5'
      },
      {
        text: 'Brutalidade policial.',
        packId: 'base-pack',
        id: 'ayomb8ed842f5kqdoqgr8cfg'
      },
      {
        text: 'Pessoas polonesas.',
        packId: 'base-pack',
        id: 'v5wn3aroylgooopsy59dijdv'
      },
      {
        text: 'Defecando de um lado para o outro. Para sempre.',
        packId: 'base-pack',
        id: 'yks10z0k2exx8we5r5ux7kpg'
      },
      {
        text: 'Defecando em um laptop e fechando-o.',
        packId: 'base-pack',
        id: 'bteef1tm4nfr2w6sb8jlzglj'
      },
      {
        text: 'Defecando na sopa.',
        packId: 'base-pack',
        id: 'fygx532xkmp85n8q675sss3f'
      },
      {
        text: 'Fraldas sujas.',
        packId: 'base-pack',
        id: 'joyvprv6rqw5v38fyke3qcwi'
      },
      {
        text: 'Escolhas de vida ruins.',
        packId: 'base-pack',
        id: 'n723yuhhhgwxpvdeob7o8jep'
      },
      {
        text: 'Higiene pessoal precária.',
        packId: 'base-pack',
        id: 'aq5yz0d30f2t08ce7hgkzlnn'
      },
      {
        text: 'Piadas sobre o Holocausto em má hora.',
        packId: 'base-pack',
        id: 'rrbtfchxv9a0xyumvuxwfx6a'
      },
      {
        text: 'Golas levantadas.',
        packId: 'base-pack',
        id: 'szcm8dye0d7xp0lmif88no65'
      },
      {
        text: 'Estrelas pornôs.',
        packId: 'base-pack',
        id: 'kc4cbnm3ms21nn6dvv2yabit'
      },
      {
        text: 'Poutine (prato canadense).',
        packId: 'base-pack',
        id: 'onpps61ot8uluyz1ke6fprhw'
      },
      { text: 'Pobreza.', packId: 'base-pack', id: 'pshphwtghr4yt6iklhu5td7r' },
      {
        text: 'Alergias poderosas.',
        packId: 'base-pack',
        id: 'uyhhr8d5ndiumal8gzgwjtg4'
      },
      {
        text: 'Coxas poderosas.',
        packId: 'base-pack',
        id: 'qkryk0583293bjcamsyugidy'
      },
      { text: 'Pulando.', packId: 'base-pack', id: 'tpiqpim9grvuzoa6ffq8kd90' },
      {
        text: 'Rezando para a homossexualidade desaparecer.',
        packId: 'base-pack',
        id: 'd7zfag74tw4opg67hyjbgw6d'
      },
      {
        text: 'Analgésicos prescritos.',
        packId: 'base-pack',
        id: 'ay1g5mpsax973ts9a777t9qe'
      },
      {
        text: 'Pré-adolescentes.',
        packId: 'base-pack',
        id: 'fq144n8wcekfhhkbzbzhm1xo'
      },
      {
        text: 'Fingindo se importar.',
        packId: 'base-pack',
        id: 'r3a6q1zqa8m3rua9nqaph6z9'
      },
      {
        text: 'Profundo respeito e apreciação pela cultura indígena.',
        packId: 'base-pack',
        id: 'hynilru6hry885syamhn83li'
      },
      {
        text: 'Pronunciando os nomes das cidades galesas do norte.',
        packId: 'base-pack',
        id: 'qkde3ho09etqx4n30quf62wy'
      },
      {
        text: 'Garotas de programa.',
        packId: 'base-pack',
        id: 'ma9nv6iewsc3tvz8cwwsog5p'
      },
      {
        text: 'Ovos de pterodáctilo.',
        packId: 'base-pack',
        id: 'qs9s4it6epm8byzefqbm2kg4'
      },
      {
        text: 'TEPT (Transtorno de Estresse Pós-Traumático).',
        packId: 'base-pack',
        id: 'zsozohza8uz4856ro1x8gmh9'
      },
      {
        text: 'Puberdade.',
        packId: 'base-pack',
        id: 'uw4zsqoo44hpw4pcxgc9dj8l'
      },
      {
        text: 'Ridicularização pública.',
        packId: 'base-pack',
        id: 'z75t399o2uv8f7e7unhrf89q'
      },
      {
        text: 'Tirando os pelos das axilas.',
        packId: 'base-pack',
        id: 'gj841jy7yufgpjzoioai5axr'
      },
      {
        text: 'Preservativos com sabor de abóbora e especiarias.',
        packId: 'base-pack',
        id: 'oja314ixn6ogw922f4o719gu'
      },
      {
        text: 'Dando um soco em um congressista.',
        packId: 'base-pack',
        id: 'pkjgo5ge8b7hp746f2un8owa'
      },
      {
        text: 'Dando um soco em um membro do parlamento.',
        packId: 'base-pack',
        id: 'eme0brhqoglrsawp6od5hnx1'
      },
      {
        text: 'Filhotes!',
        packId: 'base-pack',
        id: 'xwdvhq7mpbd0l0wp0fnp6ho4'
      },
      {
        text: 'Pussy Galore (personagem de James Bond).',
        packId: 'base-pack',
        id: 'kdbqmupvbzay2sjmhan838kh'
      },
      {
        text: 'Colocando as coisas em seus devidos lugares.',
        packId: 'base-pack',
        id: 'csuf0q2ims7pvgvl039qcelq'
      },
      {
        text: 'Queefing.',
        packId: 'base-pack',
        id: 'r5mrf3157zymcbm1xqn0tky4'
      },
      {
        text: 'O ânus imaculado da Rainha Elizabeth.',
        packId: 'base-pack',
        id: 'ke57a6d6yxv1apa2kgkdl2rs'
      },
      { text: 'Fila.', packId: 'base-pack', id: 'c9kunq45rjw473479mj0yeqd' },
      {
        text: 'Questões do SAT com preconceito racial.',
        packId: 'base-pack',
        id: 'zmrvoc9m878d10sdv1ql7dw0'
      },
      {
        text: 'Presente de Natal racista.',
        packId: 'base-pack',
        id: 'hulc9bft6nstctxf9z3fta2v'
      },
      {
        text: 'Terrorismo islâmico radical.',
        packId: 'base-pack',
        id: 'tfbvaqylbzr5h2k6cpxsswg1'
      },
      {
        text: 'Música rap.',
        packId: 'base-pack',
        id: 'i3zyfrqfwp68zofxadakj3yb'
      },
      {
        text: 'Estupro e saque.',
        packId: 'base-pack',
        id: 'rlh3cvwfh4bfxvz3jgzmiuiu'
      },
      {
        text: 'Ataques de dinossauro.',
        packId: 'base-pack',
        id: 'ry76riq3d5qsbr7gqu607biv'
      },
      {
        text: 'Dar presentes reutilizados.',
        packId: 'base-pack',
        id: 'y2g6r1xvedx0kc0wcimo7rfo'
      },
      {
        text: 'Retângulos.',
        packId: 'base-pack',
        id: 'hdvxe0slwfo4o4yaf0tgntor'
      },
      {
        text: 'Reabilitação.',
        packId: 'base-pack',
        id: 'jkenffyfpyt1n3yr100vtjcg'
      },
      {
        text: 'Repressão.',
        packId: 'base-pack',
        id: 'pw5u9cexvk69bof4cw33337c'
      },
      {
        text: 'reputação, reputação, reputação',
        packId: 'base-pack',
        id: 'hnr4i2zj5409oyion8fgm2xn'
      },
      {
        text: 'Gentrificação reversa.',
        packId: 'base-pack',
        id: 'ly1ui1az12ye7uh2wxlii4uk'
      },
      {
        text: 'Pessoas ricas.',
        packId: 'base-pack',
        id: 'gkuj8ej1crsu8dh5dkfgdbo7'
      },
      {
        text: 'Montar ao pôr do sol.',
        packId: 'base-pack',
        id: 'eykb3h4oxxwvqy4lvc5ezx3v'
      },
      {
        text: 'Anéis de pirulito.',
        packId: 'base-pack',
        id: 'euiytpfu6kblfd3vdb67j1hs'
      },
      {
        text: 'Anéis de pirulito™.',
        packId: 'base-pack',
        id: 'yb3xec618cd7tvpdol95scqw'
      },
      {
        text: 'Rip Torn chutando lésbicas anti-semitas.',
        packId: 'base-pack',
        id: 'xvizx8rt4jiarotd2eiegw8p'
      },
      {
        text: 'Copiando os Beatles.',
        packId: 'base-pack',
        id: 'xnctpi8lurhhz6dgqbplqpse'
      },
      {
        text: 'Rasgar o peito de um homem e arrancar seu coração ainda pulsante.',
        packId: 'base-pack',
        id: 'novlsj9u9meopklifxms5fsd'
      },
      {
        text: 'Níveis crescentes do mar consistentes com previsões científicas.',
        packId: 'base-pack',
        id: 'sj5zltm8pm6tw4bfdwqk9rl3'
      },
      {
        text: 'Fazer sexo no carro.',
        packId: 'base-pack',
        id: 'd5jzrzjvzzfaghwoeh31m7uq'
      },
      {
        text: 'Rob Ford.',
        packId: 'base-pack',
        id: 'y29ovs37huhcuaq6czz641dj'
      },
      {
        text: 'Roubando um banco de esperma.',
        packId: 'base-pack',
        id: 'klbz8lwkyzyhin8v8p1ynaag'
      },
      {
        text: 'Robert Downey Jr.',
        packId: 'base-pack',
        id: 'q6cqsxlorv359yrixee44vch'
      },
      {
        text: 'Robert Downey, Jr.',
        packId: 'base-pack',
        id: 'rigf79vskyi66espo97rpfva'
      },
      { text: 'RoboCop.', packId: 'base-pack', id: 'vh2g2ymbx3xt3p49hrdc0m8s' },
      {
        text: 'Rohypnol.',
        packId: 'base-pack',
        id: 'vrlu4h3mcr3rdscwjanvbnfw'
      },
      {
        text: 'Punch de sonífero.',
        packId: 'base-pack',
        id: 'xbbxjipi9gk1th36muokzg52'
      },
      {
        text: 'Soníferos.',
        packId: 'base-pack',
        id: 'qvysq3oelod4cetom99a2vqe'
      },
      {
        text: 'Acariciando a barriga de Boris Johnson até ele dormir.',
        packId: 'base-pack',
        id: 'tuvwtcve6d2jpcnfsjrcvnyb'
      },
      {
        text: 'Correr nu sob os aspersores.',
        packId: 'base-pack',
        id: 'gr5ege7jmk1sfpmw6dvhjrcu'
      },
      {
        text: 'Esgotamento de esperma.',
        packId: 'base-pack',
        id: 'dbjc75pvjuofdvqkdbphucqd'
      },
      {
        text: 'Rupert Murdoch.',
        packId: 'base-pack',
        id: 'v569xogfq78cidj9uzwe82gq'
      },
      {
        text: 'O corpo macio e horrível de Rush Limbaugh.',
        packId: 'base-pack',
        id: 'u72e0sp34qncs7nuz87aiajp'
      },
      {
        text: 'Ruth Bader Ginsburg espancando brutalmente seu pênis com um martelo de juiz.',
        packId: 'base-pack',
        id: 'b5jcbjtrulyb22yy5mvxwagz'
      },
      {
        text: 'Ryan Gosling chegando em um cavalo branco.',
        packId: 'base-pack',
        id: 'kezwevebtf7nnggarrtuotol'
      },
      {
        text: 'Patinação artística no gelo entre pessoas do mesmo sexo.',
        packId: 'base-pack',
        id: 'i8pyodmt938oringbb5j48du'
      },
      {
        text: 'Mamães santas.',
        packId: 'base-pack',
        id: 'xgmqffr5l0225fdiqqlpveip'
      },
      {
        text: 'Papai Noel.',
        packId: 'base-pack',
        id: 'jb13pe5icizh70a1avzpycqv'
      },
      {
        text: 'Pílulas loucas de Sarah Palin.',
        packId: 'base-pack',
        id: 'gwez2rg9f3irnsqiebndke9v'
      },
      {
        text: 'Solos de saxofone.',
        packId: 'base-pack',
        id: 'cbvgmjd6fkyyory81sksufao'
      },
      {
        text: 'Dizendo "Eu te amo".',
        packId: 'base-pack',
        id: 'zica73xxmullb7jy8dd05hn4'
      },
      {
        text: 'Esfolando o Milkybar Kid.',
        packId: 'base-pack',
        id: 'ojc164np04bdb314jap065cv'
      },
      {
        text: 'Escalpelamento.',
        packId: 'base-pack',
        id: 'te7trfwgix6gwfvq20okf0yz'
      },
      {
        text: 'Schmirler the Curler.',
        packId: 'base-pack',
        id: 'gb2iq7s5ci6hyo5s9a37b6al'
      },
      { text: 'Ciência.', packId: 'base-pack', id: 'z3pzvngouj32iwzvrbo05got' },
      {
        text: 'Scientology.',
        packId: 'base-pack',
        id: 'd3jx7k2z9odrbgbjjw5ifroq'
      },
      {
        text: 'Scousers.',
        packId: 'base-pack',
        id: 'rvfqdhdk9l71wzsyi0mn23r6'
      },
      {
        text: 'Orgasmo gritante.',
        packId: 'base-pack',
        id: 'ql1teznebtm74w1smwcmh5nl'
      },
      {
        text: 'Cócegas no escroto.',
        packId: 'base-pack',
        id: 'v80ilu5adx0jgpaqdzh40sr0'
      },
      {
        text: 'Esfregando sob as dobras.',
        packId: 'base-pack',
        id: 'isqb8r95zvozeh30g8diojp0'
      },
      {
        text: 'Sean Connery.',
        packId: 'base-pack',
        id: 'zxjwt6jy3mhydnoxjqd0eaa7'
      },
      {
        text: 'Sean Penn.',
        packId: 'base-pack',
        id: 'ox74c5mne8no7e22hacqeuy7'
      },
      { text: 'Sedução.', packId: 'base-pack', id: 'nrzdytl4zz3cgig30ttolgvd' },
      {
        text: 'Ver a vovó nua.',
        packId: 'base-pack',
        id: 'pqd6kv1ajit5lvlqy8ngnfkn'
      },
      {
        text: 'Ver a vovó nua.',
        packId: 'base-pack',
        id: 'x2a0wfo0kafj8evw4hg1k6b5'
      },
      {
        text: 'Ver meu pai chorar.',
        packId: 'base-pack',
        id: 'xlfu6wdxy6c5dqjr68epau25'
      },
      {
        text: 'Ver o que acontece quando você trancar pessoas em uma sala com gaivotas famintas.',
        packId: 'base-pack',
        id: 'guttcww0bskkc04qcycgwcdf'
      },
      {
        text: 'Fervendo de ressentimento silencioso.',
        packId: 'base-pack',
        id: 'sw0x6y2z1oas6wjt4ejsgjfs'
      },
      {
        text: 'Lavanderia que se dobra sozinha.',
        packId: 'base-pack',
        id: 'sik0bdi4y9qc2d31s3100isi'
      },
      {
        text: 'Auto-aversão.',
        packId: 'base-pack',
        id: 'a6dk8k22uaeg1absfzhztnki'
      },
      {
        text: 'Vender crack para crianças.',
        packId: 'base-pack',
        id: 'z4kl29qls98ws6ayqw0d23a6'
      },
      {
        text: 'Vender gelo para crianças.',
        packId: 'base-pack',
        id: 'mpdkw1431h61guxvb7t55xba'
      },
      { text: 'Seppuku.', packId: 'base-pack', id: 'nnybh7f65e88vuvmuw3ow5a3' },
      {
        text: 'Servidão.',
        packId: 'base-pack',
        id: 'ho2ex061jemt46xpm49vkdye'
      },
      {
        text: 'Sete mortos e três em estado crítico.',
        packId: 'base-pack',
        id: 'k0qi8s10n5owj0w8npgx8715'
      },
      {
        text: 'Sexo com animais.',
        packId: 'base-pack',
        id: 'iwc7znndl90r3mckmfy8dk7o'
      },
      {
        text: 'Sexo com Patrick Stewart.',
        packId: 'base-pack',
        id: 'wdvksxqove3xiw0ta5x3xjfr'
      },
      { text: 'Sexting.', packId: 'base-pack', id: 'f1defop5d2594hq4wjuvo260' },
      {
        text: 'Humilhação sexual.',
        packId: 'base-pack',
        id: 'd08011x19go8wvr871uprt9m'
      },
      {
        text: 'Urinar sexualmente.',
        packId: 'base-pack',
        id: 'xye5r623khfosgafqrw9fzff'
      },
      {
        text: 'Tensão sexual.',
        packId: 'base-pack',
        id: 'txba4je8zo4zyhb367r8w1nd'
      },
      {
        text: 'Lutas sensuais de travesseiros.',
        packId: 'base-pack',
        id: 'ne01rut2k6iolykq9u4u8foq'
      },
      {
        text: 'Chacoalhar um bebê até ele parar de chorar.',
        packId: 'base-pack',
        id: 'tgwbrdlaejwiiizjv6fhdeby'
      },
      {
        text: 'Transformistas.',
        packId: 'base-pack',
        id: 'kp9icqut3tykvb42uumgq6xg'
      },
      {
        text: "Carreira de ator de Shaquille O'Neal.",
        packId: 'base-pack',
        id: 'cjb499ru3573oxkdhta8p1dx'
      },
      {
        text: 'Compartilhando agulhas.',
        packId: 'base-pack',
        id: 'omvmobng4apjo88179p53b9r'
      },
      {
        text: 'Objetos brilhantes.',
        packId: 'base-pack',
        id: 'lnd27wnyr70fsv7zl7yykoik'
      },
      {
        text: 'Enviando criminosos para a Austrália.',
        packId: 'base-pack',
        id: 'sy8npwbim8jr9b9x5uxijjxg'
      },
      {
        text: 'Defecando uma salsicha Cumberland perfeita.',
        packId: 'base-pack',
        id: 'zz1qt86myuux2vzf4077irdj'
      },
      {
        text: 'Defecando um rosto gritante.',
        packId: 'base-pack',
        id: 'tg465eu7foxq4gyohjs41tsu'
      },
      {
        text: 'Baseados e baseados.',
        packId: 'base-pack',
        id: 'zdgeenyhh487kyebe8fukcmi'
      },
      {
        text: 'Chegar a uma orgia pela comida.',
        packId: 'base-pack',
        id: 'dbl5owr5g11nvust9smht88f'
      },
      {
        text: 'Calando a boca para poder assistir ao jogo.',
        packId: 'base-pack',
        id: 'j0i91jc86i5go6qt20n0uq5r'
      },
      {
        text: 'Calando a boca para poder assistir ao jogo.',
        packId: 'base-pack',
        id: 'r84uitndylxhzpdssrgp8bab'
      },
      {
        text: 'Calando a boca para poder assistir à partida.',
        packId: 'base-pack',
        id: 'u9vi1t82iyzpie0xtyo24oo8'
      },
      {
        text: 'Decote lateral.',
        packId: 'base-pack',
        id: 'acow76vk94qt49mbisuvbm3w'
      },
      {
        text: 'Silêncio.',
        packId: 'base-pack',
        id: 't2lmvyu2l1ebm6nupbr6kw6s'
      },
      {
        text: 'Bebendo manteiga de pipoca artificial.',
        packId: 'base-pack',
        id: 'vzjckug8s21bm3t15m1xq2bs'
      },
      {
        text: 'Sentar-se em cima do meu rosto e me chamar de lixo.',
        packId: 'base-pack',
        id: 'p1lzmojzxya0i2lli265lbw1'
      },
      {
        text: 'Sentando-se em cima do meu rosto.',
        packId: 'base-pack',
        id: 'oe6zwa9re9y2g93m9lpwuol2'
      },
      {
        text: 'Sentando-se no rosto de alguém.',
        packId: 'base-pack',
        id: 'xe260avmf8hm0j4helz0tbwo'
      },
      {
        text: 'Esqueleto.',
        packId: 'base-pack',
        id: 'vadsb9opwtrkmijxqvtrmb67'
      },
      {
        text: 'Skippy, o Canguru',
        packId: 'base-pack',
        id: 'gjdrc3xznis2ppfgydhye116'
      },
      {
        text: 'Dando um tapa em um biscoito da boca de um órfão.',
        packId: 'base-pack',
        id: 'pnttarp6pms1yp39o6jqafin'
      },
      {
        text: 'Dando tapas em Nigel Farage repetidamente.',
        packId: 'base-pack',
        id: 'wmsfs3wac2d2mn7ie3kf7su2'
      },
      {
        text: 'Dando tapas em Nigel Farage repetidamente.',
        packId: 'base-pack',
        id: 'v7pj97arr8ji3e2geub45pqs'
      },
      {
        text: 'Massacrando civis inocentes.',
        packId: 'base-pack',
        id: 'epw9cyeqik7v2mqr1iro1fd8'
      },
      { text: 'Eslavos.', packId: 'base-pack', id: 'lonx3qjpz2pd02oae972fbhj' },
      { text: 'varíola.', packId: 'base-pack', id: 'aszf6yot3ba0e1l242ya1jxt' },
      { text: 'Smegma.', packId: 'base-pack', id: 'ua5edyidmmzyqlsqzayyw8gb' },
      {
        text: 'Fluido de limpeza de cartucho de SNES.',
        packId: 'base-pack',
        id: 'tmdlh4xowtxh22btu64vercb'
      },
      {
        text: 'Cheirar e beijar meus pés.',
        packId: 'base-pack',
        id: 'e9erpan5pc8uzd0xno1t1qab'
      },
      {
        text: 'Cheirar cola.',
        packId: 'base-pack',
        id: 'dr1xh7759sbdp410wo4wyqg5'
      },
      {
        text: 'Gelinhos de meleca.',
        packId: 'base-pack',
        id: 's0cb52uiom9gc5o59as9j4ip'
      },
      {
        text: 'Soluçando em um Hungry-Man™ Frozen Dinner.',
        packId: 'base-pack',
        id: 'mlfxhsm38ttt46b4ub58t9p3'
      },
      {
        text: 'Sexo missionário suave e carinhoso.',
        packId: 'base-pack',
        id: 'my1k0t3czxfm22950rjow0hf'
      },
      {
        text: 'Sujar-se.',
        packId: 'base-pack',
        id: 'qttw7ktey7o21unjdh1jdn1s'
      },
      {
        text: 'Resolver problemas com violência.',
        packId: 'base-pack',
        id: 'q1vb0usr8zny8vyiq58swmd9'
      },
      {
        text: 'Piratas somalis.',
        packId: 'base-pack',
        id: 'yhx9r5tc3s0cef992otb58ti'
      },
      {
        text: 'Alguma maldita paz e tranquilidade.',
        packId: 'base-pack',
        id: 'k70lzyw8bqq1bmiu63l87rf5'
      },
      {
        text: 'Algum idiota gritando "Mais Cowbell".',
        packId: 'base-pack',
        id: 'ikmhoorli5mrrqffhqc5lv0n'
      },
      {
        text: 'Um pouco de base, rímel e um toque de blush.',
        packId: 'base-pack',
        id: 'cgr0xp0xoxp0j631uk1n9374'
      },
      {
        text: 'Alguma maldita paz e tranquilidade.',
        packId: 'base-pack',
        id: 'fx0y9xp6a6uy9t0913z7xy3e'
      },
      {
        text: 'Algum cara.',
        packId: 'base-pack',
        id: 'anax8supbxl0upwbiuw7psz4'
      },
      {
        text: 'Algum tipo de homem-pássaro.',
        packId: 'base-pack',
        id: 'jdglm3c1e78s5bqyawtempfz'
      },
      {
        text: 'Alguns dos melhores rappers do jogo.',
        packId: 'base-pack',
        id: 'u5qe1du0thoup3kkwpvn079g'
      },
      {
        text: 'Algum moleque punk que roubou meu sanduíche de peru.',
        packId: 'base-pack',
        id: 'yduf0zbtwqy0mq0gq5ewc7qy'
      },
      {
        text: 'Alguma Kentucky Durban realmente pegajosa.',
        packId: 'base-pack',
        id: 'vs8x1px8mkvhyggqiv9pjuh6'
      },
      {
        text: 'Desculpe, este conteúdo não pode ser visualizado em sua região.',
        packId: 'base-pack',
        id: 'nz2abv8qujohcisj8kq65v11'
      },
      {
        text: 'Sopa que está muito quente.',
        packId: 'base-pack',
        id: 'xvtdjlv1mj6aixykbjb7b270'
      },
      {
        text: 'Espaguete? De novo?',
        packId: 'base-pack',
        id: 'kekkdw92td0ls86hrpyq63ar'
      },
      {
        text: 'Espanhóis.',
        packId: 'base-pack',
        id: 'p57f9optd0a7lg3qzfmlaf3c'
      },
      {
        text: 'Abdômen espetacular.',
        packId: 'base-pack',
        id: 'kxz1f9mj3l82tvwh9vh3utw4'
      },
      {
        text: 'Gastar o dinheiro suado dos meus pais.',
        packId: 'base-pack',
        id: 'xaa2r568yvc28ssijqgpvhn6'
      },
      {
        text: 'Baleias do espermatozóide.',
        packId: 'base-pack',
        id: 'kkptxcq0is7brz1cxop9onsi'
      },
      {
        text: 'Spirit Airlines.',
        packId: 'base-pack',
        id: 'h5pchd9wcbug50cyahpk7l1c'
      },
      {
        text: 'Combustão humana espontânea.',
        packId: 'base-pack',
        id: 'hpobjir4dt2kk6sf4o7olebm'
      },
      { text: 'Stalin.', packId: 'base-pack', id: 'nucbgrrnrhg8abhf69tho72s' },
      {
        text: 'Olhando para uma pintura e dizendo "hmmmmmmm...".',
        packId: 'base-pack',
        id: 'k56994ygnijrtzx3v2mn5t2y'
      },
      {
        text: 'Stephen Harper.',
        packId: 'base-pack',
        id: 'fqfktt384q6bdcv983nbl0qb'
      },
      {
        text: 'Stephen Hawking.',
        packId: 'base-pack',
        id: 'f5ximoeq8rflh99k8yx9ahhq'
      },
      {
        text: 'Stephen Hawking falando obscenidades.',
        packId: 'base-pack',
        id: 'yd1ttpoqq4qmfya6yy73hase'
      },
      {
        text: 'Steve Bannon.',
        packId: 'base-pack',
        id: 'bscq6p2kueyp3xi4g2g0kmw5'
      },
      {
        text: 'Steve Irwin.',
        packId: 'base-pack',
        id: 'lh0z6d93gc3qnsos2irryp4k'
      },
      {
        text: 'Abafando uma risadinha ao mencionar hutus e tutsis.',
        packId: 'base-pack',
        id: 'n31msl9xzi3kzo9gyg37jf58'
      },
      {
        text: 'Ainda sendo virgem.',
        packId: 'base-pack',
        id: 'p005kqbson0zoo6rjkttl522'
      },
      {
        text: 'Síndrome de Estocolmo.',
        packId: 'base-pack',
        id: 'tzbkxt6efyo8li1oqt3g7p0b'
      },
      {
        text: 'Stormtroopers.',
        packId: 'base-pack',
        id: 'mgsq8iv406y56sjxfw4pevdk'
      },
      {
        text: 'Perigo de estranhos.',
        packId: 'base-pack',
        id: 'lgxzbksoqe7rtp5h2chrgj3h'
      },
      {
        text: 'Personagens femininas fortes.',
        packId: 'base-pack',
        id: 'fffbhzmdzjdpfcjm6f9vka6u'
      },
      { text: 'Dublês.', packId: 'base-pack', id: 'zzh1gw31q5vu2ixk5enjpcyo' },
      {
        text: 'Professores substitutos.',
        packId: 'base-pack',
        id: 'b2u2q8b1oy2t7r64hvi1mgdp'
      },
      {
        text: 'Chupando alguns paus para não ser recrutado.',
        packId: 'base-pack',
        id: 'gmpgwx77rrnuihiwmy2f6eak'
      },
      {
        text: 'Doença de Explosão Repentina de Cocô.',
        packId: 'base-pack',
        id: 'kxlqwikjidbiky6sdd6rgmw5'
      },
      {
        text: 'Pensamentos suicidas.',
        packId: 'base-pack',
        id: 'y1yccrovphsc34drnexmo4ay'
      },
      {
        text: 'Convocando Harold Holt do mar em tempos de grande necessidade.',
        packId: 'base-pack',
        id: 'ms8if9hs7yb6nrqgryjqldp1'
      },
      {
        text: 'Sol e arco-íris.',
        packId: 'base-pack',
        id: 'cuunu0digug6oqkwa0l9kafd'
      },
      {
        text: 'Sexo surpresa!',
        packId: 'base-pack',
        id: 'bammaqhn67pm5mufvoibiii9'
      },
      { text: 'Estilo.', packId: 'base-pack', id: 'j1iwszn6de2zhr98duvgaiwj' },
      {
        text: 'Doce e doce vingança.',
        packId: 'base-pack',
        id: 'j5z5eem6h9izelk7ysf1i9cz'
      },
      {
        text: 'Mudando para a Geico®.',
        packId: 'base-pack',
        id: 'vumqgec1wmjbu5jthn08rsys'
      },
      {
        text: 'Mergulhando.',
        packId: 'base-pack',
        id: 'x6ulgrg2glfbk8jdkbdg15dd'
      },
      {
        text: 'Soluções de gerenciamento sinérgico.',
        packId: 'base-pack',
        id: 'ksulrcn6cr7q9s4y66bzx22n'
      },
      {
        text: 'Sexo xaroposo com uma árvore de bordo.',
        packId: 'base-pack',
        id: 'g95xfhwcidtmbxb1xbp0roar'
      },
      {
        text: 'Take-backsies.',
        packId: 'base-pack',
        id: 's6ogdnr447qf2ugm72tylozp'
      },
      {
        text: 'Levar um minuto para realmente entender o que Shakespeare está querendo dizer nesta cena.',
        packId: 'base-pack',
        id: 'keouzuom6ppjg1fi1lzl6o1r'
      },
      {
        text: 'Levar uma esposa-ovelha.',
        packId: 'base-pack',
        id: 'byhj6btyzqhlbqyb54bkvk4w'
      },
      {
        text: 'Tirar sua camisa.',
        packId: 'base-pack',
        id: 'mgotog1n344x1jrdidj9moqb'
      },
      {
        text: 'Slinkys emaranhados.',
        packId: 'base-pack',
        id: 'ityk592c02dl79zxtbzojo22'
      },
      {
        text: 'Sapateado como se não houvesse amanhã.',
        packId: 'base-pack',
        id: 't6xm5celacmjs58n96lgpb6z'
      },
      {
        text: 'Decote lateral elegante.',
        packId: 'base-pack',
        id: 'u30rm7qu2mjkdptkmq14jtwc'
      },
      {
        text: 'Ensinar um robô a amar.',
        packId: 'base-pack',
        id: 'p504ldy6rjvw4dzl0we5q2zj'
      },
      {
        text: 'Exercícios de construção de equipe.',
        packId: 'base-pack',
        id: 'dxer5z97cbo6fi8j1110yo4s'
      },
      {
        text: 'Exercícios de construção de equipe.',
        packId: 'base-pack',
        id: 'op1b4ujzu45r3ii9j0z5ufpv'
      },
      {
        text: 'Rasgando aquela bunda como papel de embrulho na manhã de Natal.',
        packId: 'base-pack',
        id: 'yi0bgzttzoozlhvpvhyt4n03'
      },
      {
        text: 'Gravidez na adolescência.',
        packId: 'base-pack',
        id: 'lno6vp8p1z7kxut1gmhplsbe'
      },
      {
        text: 'Contar uma história ruim que não leva a lugar nenhum.',
        packId: 'base-pack',
        id: 'wqspcofgkp93zp1a51qapgha'
      },
      {
        text: 'Pornô de tentáculos.',
        packId: 'base-pack',
        id: 'aeqmfasxx6zs09o0qmeekakh'
      },
      {
        text: 'Terroristas.',
        packId: 'base-pack',
        id: 'p0vrckrxm40mrr9xupoi9ugm'
      },
      {
        text: 'A perna protética de Terry Fox.',
        packId: 'base-pack',
        id: 'rvog0vrrglb73card77woo55'
      },
      {
        text: 'Torsão testicular.',
        packId: 'base-pack',
        id: 'qzznrlkwxsq9pw8ksj8ve28z'
      },
      {
        text: 'Aquela família estranha que pensa que é "Segunda-feira de cibersexo".',
        packId: 'base-pack',
        id: 'r35lefj4su1nlcsjxdfv4h43'
      },
      {
        text: 'Aquele Teletubbie gay.',
        packId: 'base-pack',
        id: 'ldccq6ti0od4leqdx6jdpmqy'
      },
      {
        text: 'Aquela coisa que eletrocuta seus abdominais.',
        packId: 'base-pack',
        id: 'prr829yx16y7b7zw6w15av8l'
      },
      {
        text: 'O Sonho Americano.',
        packId: 'base-pack',
        id: 'd84z8j1u1x8423u0thgay79p'
      },
      {
        text: 'Os Amish.',
        packId: 'base-pack',
        id: 'ptfnkta9x87s60h45xa4iegb'
      },
      {
        text: 'A chegada da pizza.',
        packId: 'base-pack',
        id: 'nhmh308ig0adn21mtw9cyt8z'
      },
      {
        text: 'A arte da sedução.',
        packId: 'base-pack',
        id: 'xff9wvn45w4yk1hq4s9xrhur'
      },
      {
        text: 'O bebê que arruinou minha vagina.',
        packId: 'base-pack',
        id: 'bngkgt73hv74dhqj17z1gmci'
      },
      {
        text: 'Final da temporada de The Bachelorette.',
        packId: 'base-pack',
        id: 'bjyo8bv3jpn34f6bh7o18ds9'
      },
      {
        text: 'O Big Bang.',
        packId: 'base-pack',
        id: 'dqp5oh5btl9kdxd2v544qg0f'
      },
      {
        text: 'O grande buraco fudido na camada de ozônio.',
        packId: 'base-pack',
        id: 'ccncvr52z0zp3wyisjf0edgs'
      },
      {
        text: 'A Peste Negra.',
        packId: 'base-pack',
        id: 'm9w41vtw6l01di5v5j0mxcgm'
      },
      {
        text: 'O Sangue de Cristo.',
        packId: 'base-pack',
        id: 'sp9cel9bo60n1knsni5koacp'
      },
      {
        text: 'Os malditos galeses.',
        packId: 'base-pack',
        id: 'x2769aj328s1tdsg2az4wfe3'
      },
      { text: 'O BNP.', packId: 'base-pack', id: 'bbll3y1hcu9x3jvjjbw42qec' },
      {
        text: 'O bombardeio de Nagasaki.',
        packId: 'base-pack',
        id: 'wxl2egh5j8lywbb7df01y6ud'
      },
      {
        text: 'As ereções dos idosos.',
        packId: 'base-pack',
        id: 'gvm5lmjm61t0c1ll1w7hg8df'
      },
      {
        text: 'Os Escoteiros da América.',
        packId: 'base-pack',
        id: 's3sjc2nqzr4ug1m9b5vglwnc'
      },
      { text: 'A selva.', packId: 'base-pack', id: 'h6a253pmdkqwptmoguag12mf' },
      {
        text: 'O Olhar do Ursinho Carinhoso.',
        packId: 'base-pack',
        id: 'fsxulujn8cpx0ntwebvuh21d'
      },
      {
        text: 'A equipe de ginástica chinesa.',
        packId: 'base-pack',
        id: 'g0egqy7e2sv61cpuff5ku4og'
      },
      {
        text: 'O crônico.',
        packId: 'base-pack',
        id: 'qmryg0z7wyom8vgctxnvfkmt'
      },
      {
        text: 'O clitóris.',
        packId: 'base-pack',
        id: 'ninplpgdlqw5bsdoqn8lnihy'
      },
      {
        text: 'O frescor refrescante de Coca-Cola®.',
        packId: 'base-pack',
        id: 'dziupe9qzhvgdm5936tgjct5'
      },
      {
        text: 'O frescor refrescante da Pepsi.',
        packId: 'base-pack',
        id: 'j53x9aprqq5gipnfkfdyweuy'
      },
      {
        text: 'O frescor refrescante de Pepsi®.',
        packId: 'base-pack',
        id: 'q0bhzd724hxcwuaoxn4pgyml'
      },
      {
        text: 'O sexo selvagem e estalado que seus pais estão fazendo agora mesmo.',
        packId: 'base-pack',
        id: 'h0cl8xobwlt2wi29ncd6akxh'
      },
      {
        text: 'O Daily Mail.',
        packId: 'base-pack',
        id: 'y5uhn9o724ms45ughvdzc0t1'
      },
      {
        text: 'O Dalai Lama.',
        packId: 'base-pack',
        id: 'rn0224d6x3exr65beb7xnl74'
      },
      {
        text: 'A Dança da Fada Açucarada.',
        packId: 'base-pack',
        id: 'ydc1p9dxtxu2j4dbozpb2lbe'
      },
      {
        text: 'Os deformados.',
        packId: 'base-pack',
        id: 'mvixhpwix5fglbwpfn74rjdz'
      },
      {
        text: 'O Próprio Diabo.',
        packId: 'base-pack',
        id: 'ziaciqt61l3djvf24rcg514l'
      },
      {
        text: 'O Selo de Aprovação do Donald Trump.™',
        packId: 'base-pack',
        id: 'pno2fixg21pyk2xwa9yybqa6'
      },
      {
        text: 'O clube de teatro.',
        packId: 'base-pack',
        id: 'rlt0edu38bjc2f8nmrz8k6wh'
      },
      {
        text: 'A economia.',
        packId: 'base-pack',
        id: 'n96z06o3menyz2ctpp4jnqw6'
      },
      { text: 'O EDL.', packId: 'base-pack', id: 'vclaqm1yayhe2citzhvcbpv9' },
      {
        text: 'O fim dos tempos.',
        packId: 'base-pack',
        id: 'd7ealh46qs1n110ed9bocm7t'
      },
      {
        text: 'Todo o elenco de Downton Abbey.',
        packId: 'base-pack',
        id: 'j0zhj2k0h1knxufcgt3q0q1u'
      },
      {
        text: 'Todo o Coral Tabernáculo Mórmon.',
        packId: 'base-pack',
        id: 'xke5rjz1fv20uhuk1d08dlp4'
      },
      {
        text: 'Todo o Coral Tabernáculo Mórmon.',
        packId: 'base-pack',
        id: 'za1y2r2nvaa1b6wheeaeup0v'
      },
      {
        text: 'O orgasmo feminino.',
        packId: 'base-pack',
        id: 'yojw7jx6i2rv6cmt3y4q1phy'
      },
      { text: 'O FLQ.', packId: 'base-pack', id: 'j033lr2219fokyr0ato9r5hc' },
      {
        text: 'A flauta.',
        packId: 'base-pack',
        id: 'p5l6hy5v9eseg8d0xxl9jj5i'
      },
      {
        text: 'A loucura do homem.',
        packId: 'base-pack',
        id: 'vg1l50o7t6oakaz0h8suek4g'
      },
      {
        text: 'A fruta proibida.',
        packId: 'base-pack',
        id: 'p0cjw8pmfb3m3zv6vztmxzkq'
      },
      { text: 'A Força.', packId: 'base-pack', id: 'rcxmca85in9hrepojay98nq7' },
      {
        text: 'Take-backsies.',
        packId: 'base-pack',
        id: 'mpq6f6j2vd4n0odp21pwxi0p'
      },
      {
        text: 'Levar um minuto para realmente entender o que Shakespeare está querendo dizer nesta cena.',
        packId: 'base-pack',
        id: 'aylnl3az3t3cdkwkefqxqllr'
      },
      {
        text: 'Levar uma esposa-ovelha.',
        packId: 'base-pack',
        id: 'aeags3eye5j1i6u6hymh0nds'
      },
      {
        text: 'Tirar sua camisa.',
        packId: 'base-pack',
        id: 'jvjle1wax84yxd7om2i5kkz9'
      },
      {
        text: 'Slinkys emaranhados.',
        packId: 'base-pack',
        id: 'l36rjq9wplhgvad2enhyoqjn'
      },
      {
        text: 'Sapateado como se não houvesse amanhã.',
        packId: 'base-pack',
        id: 's5zf77eyk6hm3geegjhbanxn'
      },
      {
        text: 'Decote lateral elegante.',
        packId: 'base-pack',
        id: 'yx8w4xfxgx1kfwqv4q1rnfwm'
      },
      {
        text: 'Ensinar um robô a amar.',
        packId: 'base-pack',
        id: 'erchu9uk7hxpegi38wrah3mw'
      },
      {
        text: 'Exercícios de construção de equipe.',
        packId: 'base-pack',
        id: 'vz9q0zq2qug65t053wm26zsq'
      },
      {
        text: 'Exercícios de construção de equipe.',
        packId: 'base-pack',
        id: 'zkyv86zhj7ifk05ut58tly8a'
      },
      {
        text: 'Rasgando aquela bunda como papel de embrulho na manhã de Natal.',
        packId: 'base-pack',
        id: 'dx8lz1j2qs3d7liz5tjwa8cg'
      },
      {
        text: 'Gravidez na adolescência.',
        packId: 'base-pack',
        id: 'd15txvlc50rm6imt2ioq0pnd'
      },
      {
        text: 'Contar uma história ruim que não leva a lugar nenhum.',
        packId: 'base-pack',
        id: 'udc416gk4kz2225m3w6kfqy3'
      },
      {
        text: 'Pornô de tentáculos.',
        packId: 'base-pack',
        id: 'f8uoesws60oli4ihyr29v4b7'
      },
      {
        text: 'Terroristas.',
        packId: 'base-pack',
        id: 'yzm9e9wma8rtkwnqiu5ouoea'
      },
      {
        text: 'A perna protética de Terry Fox.',
        packId: 'base-pack',
        id: 'rsgqkpkmzwh8a77yov4ru0ds'
      },
      {
        text: 'Torsão testicular.',
        packId: 'base-pack',
        id: 'is3vvyxraevsa9gvcxs3srbi'
      },
      {
        text: 'Aquela família estranha que pensa que é "Segunda-feira de cibersexo".',
        packId: 'base-pack',
        id: 'agvqo1tr3irjc8or3jxqsnx7'
      },
      {
        text: 'Aquele Teletubbie gay.',
        packId: 'base-pack',
        id: 'boiobb2tsdc1vnm26m0877t9'
      },
      {
        text: 'Aquela coisa que eletrocuta seus abdominais.',
        packId: 'base-pack',
        id: 'fah55whhv1ak82ema3po6yn0'
      },
      {
        text: 'O Sonho Americano.',
        packId: 'base-pack',
        id: 'zlfavkw78bpo01p439fyfq8d'
      },
      {
        text: 'Os Amish.',
        packId: 'base-pack',
        id: 'k00b3mwcp67k781emlyoj36p'
      },
      {
        text: 'A chegada da pizza.',
        packId: 'base-pack',
        id: 'iosvx795w9i98apomi4wfx3k'
      },
      {
        text: 'A arte da sedução.',
        packId: 'base-pack',
        id: 'nro5oe2y3o49x2v5gzg8pn6l'
      },
      {
        text: 'O bebê que arruinou minha vagina.',
        packId: 'base-pack',
        id: 'gxxj2yclpstc7wsu9x9m7z75'
      },
      {
        text: 'Final da temporada de The Bachelorette.',
        packId: 'base-pack',
        id: 'ezg2kwy8dsszqi4gg9ujig2e'
      },
      {
        text: 'O Big Bang.',
        packId: 'base-pack',
        id: 'dilwwn6tqzr8xa198r8v7on8'
      },
      {
        text: 'O grande buraco fudido na camada de ozônio.',
        packId: 'base-pack',
        id: 'e7o5eafg84atf5b87con2oyj'
      },
      {
        text: 'A Peste Negra.',
        packId: 'base-pack',
        id: 'r2gtlxmx567cyrsq1m57gs1p'
      },
      {
        text: 'O Sangue de Cristo.',
        packId: 'base-pack',
        id: 'tcyedhvhp9hurzu4fn9s6jhs'
      },
      {
        text: 'Os malditos galeses.',
        packId: 'base-pack',
        id: 's87j8d2jqxycny84my1mvx5x'
      },
      { text: 'O BNP.', packId: 'base-pack', id: 'gikaihiml17z2bp7v4ee6r02' },
      {
        text: 'O bombardeio de Nagasaki.',
        packId: 'base-pack',
        id: 'ohep3dgjhwgopl9fl6dpt7vp'
      },
      {
        text: 'As ereções dos idosos.',
        packId: 'base-pack',
        id: 'fi0521tvr38fzg48pnt7139c'
      },
      {
        text: 'Os Escoteiros da América.',
        packId: 'base-pack',
        id: 'cbnupi2v3ok193r5pgbv4o61'
      },
      { text: 'A selva.', packId: 'base-pack', id: 'bs32sq22kbquv3c5fjhqo7np' },
      {
        text: 'O Olhar do Ursinho Carinhoso.',
        packId: 'base-pack',
        id: 'fq1qcoh9ts41tu69hs6f98tn'
      },
      {
        text: 'A equipe de ginástica chinesa.',
        packId: 'base-pack',
        id: 'sfflz6xiq8ypo2jpqssq0a5i'
      },
      {
        text: 'O crônico.',
        packId: 'base-pack',
        id: 'vc8i0ucxm9ccupm5fo0am9us'
      },
      {
        text: 'O clitóris.',
        packId: 'base-pack',
        id: 'cs6gmkvjigslflsxncn86ixc'
      },
      {
        text: 'O frescor refrescante de Coca-Cola®.',
        packId: 'base-pack',
        id: 'me80cfhhp0uwgfaa1fb2e4wq'
      },
      {
        text: 'O frescor refrescante da Pepsi.',
        packId: 'base-pack',
        id: 'nlq720nsqerpsanqsl4n6x9a'
      },
      {
        text: 'O frescor refrescante de Pepsi®.',
        packId: 'base-pack',
        id: 'prq8hy3x2lbtbsw2knq8j8vc'
      },
      {
        text: 'O sexo selvagem e estalado que seus pais estão fazendo agora mesmo.',
        packId: 'base-pack',
        id: 'ens8tlof3ln7acu1cntcpmh5'
      },
      {
        text: 'O Daily Mail.',
        packId: 'base-pack',
        id: 'eoescwiaajaq5mq4jkqhszgl'
      },
      {
        text: 'O Dalai Lama.',
        packId: 'base-pack',
        id: 'xl6tjh9fjqhks9plrcnr86az'
      },
      {
        text: 'A Dança da Fada Açucarada.',
        packId: 'base-pack',
        id: 's3gdd9p0ffz112cizygbwvuw'
      },
      {
        text: 'Os deformados.',
        packId: 'base-pack',
        id: 'ygqqhkrspwahibghi3q0mv45'
      },
      {
        text: 'O Próprio Diabo.',
        packId: 'base-pack',
        id: 'tojgm02ry06josxwrgsntkbi'
      },
      {
        text: 'O Selo de Aprovação do Donald Trump.™',
        packId: 'base-pack',
        id: 'wmjl4qrtlw621gugv5dsvc7w'
      },
      {
        text: 'O clube de teatro.',
        packId: 'base-pack',
        id: 'stuarzaljl078tdudg8tg9wc'
      },
      {
        text: 'A economia.',
        packId: 'base-pack',
        id: 'kprfntdbfzp7id6p92aqtsvv'
      },
      { text: 'O EDL.', packId: 'base-pack', id: 'bhibdlholedkledvwq4kxl0c' },
      {
        text: 'O fim dos tempos.',
        packId: 'base-pack',
        id: 'oedkmlqicdgsy402a2wd48yu'
      },
      {
        text: 'Todo o elenco de Downton Abbey.',
        packId: 'base-pack',
        id: 'vsomuh02tyx7p76vg3fyevwl'
      },
      {
        text: 'Todo o Coral Tabernáculo Mórmon.',
        packId: 'base-pack',
        id: 'c5x0k4l03y1wf6y0qjdzv4t3'
      },
      {
        text: 'Todo o Coral Tabernáculo Mórmon.',
        packId: 'base-pack',
        id: 'bkoj7apu0ojtjporbwwl5dwd'
      },
      {
        text: 'O orgasmo feminino.',
        packId: 'base-pack',
        id: 'mpmkrmqqy7lu6pir0yb3e4y5'
      },
      { text: 'O FLQ.', packId: 'base-pack', id: 'hehne2xoupjbophpz8vtrcd7' },
      {
        text: 'A flauta.',
        packId: 'base-pack',
        id: 'yq6qd7kzspf85bd6id1o52zu'
      },
      {
        text: 'A loucura do homem.',
        packId: 'base-pack',
        id: 'mwwzzc7o8f1ozrto381at3zf'
      },
      {
        text: 'A fruta proibida.',
        packId: 'base-pack',
        id: 'ube5q0e1ropo7elfbeej9qy8'
      },
      { text: 'A Força.', packId: 'base-pack', id: 'o2ja4h448zjgaloxkac38ivz' },
      {
        text: 'Os franceses.',
        packId: 'base-pack',
        id: 'ap4ml6sccdmohsn9m3rjyb4s'
      },
      { text: 'Os gays.', packId: 'base-pack', id: 'l7hen5j62fuj8faxgzy3d4ff' },
      {
        text: 'O teto de vidro.',
        packId: 'base-pack',
        id: 'o9oq5yhaxk5qx7yjb1ggl5td'
      },
      {
        text: 'A Grande Depressão.',
        packId: 'base-pack',
        id: 'l8ja06wsfmp5k3hkge0b9dzz'
      },
      {
        text: 'A Grande Guerra do Emu.',
        packId: 'base-pack',
        id: 'jkmto3m0d19t31psvg9mrbph'
      },
      {
        text: 'Os Gulags.',
        packId: 'base-pack',
        id: 'c8ve93hpucy7kh8iovv18x3u'
      },
      {
        text: 'Os caras de Queer Eye.',
        packId: 'base-pack',
        id: 'yhyzsqmsqt7rslz3u8kiukxe'
      },
      {
        text: 'O Hamburglar.',
        packId: 'base-pack',
        id: 'ubnhaz2oiseju1ob7nfpnnzq'
      },
      {
        text: 'O trabalhador mexicano esforçado.',
        packId: 'base-pack',
        id: 'c0hecg8jui5p970kbdtq2rui'
      },
      {
        text: 'o calor de uma cama luxuosa',
        packId: 'base-pack',
        id: 'l7d1wd4qxl8zbhzqqdrfpwbd'
      },
      {
        text: 'Os irmãos Hemsworth.',
        packId: 'base-pack',
        id: 'b6pkizvmocmbqrux8otxx63u'
      },
      {
        text: 'O soluço.',
        packId: 'base-pack',
        id: 'p9can4xpe6x5weojheypku89'
      },
      {
        text: 'O Desastre de Hillsborough.',
        packId: 'base-pack',
        id: 'hj76gh371rk17f28876l483x'
      },
      {
        text: 'A Bíblia Sagrada.',
        packId: 'base-pack',
        id: 'b8nekfirk2znrmuyktx10kh3'
      },
      {
        text: 'A agenda homossexual.',
        packId: 'base-pack',
        id: 'am0nlyxqdto6s7aocgewfcm9'
      },
      {
        text: 'O estilo de vida homossexual.',
        packId: 'base-pack',
        id: 'xj6i6514hssehdlrz613l02p'
      },
      {
        text: 'O Monstro do Mel.',
        packId: 'base-pack',
        id: 'zpjxpwkty3q6oigdah8ssbc8'
      },
      {
        text: 'A Centopeia Humana: edição infinita.',
        packId: 'base-pack',
        id: 'ds3ftkkx1xs6xvpr1czhpg2f'
      },
      {
        text: 'A Hustle.',
        packId: 'base-pack',
        id: 'fc9xc25g17mmn52dyx1qgiv8'
      },
      {
        text: 'A ilusão de escolha em uma sociedade capitalista avançada.',
        packId: 'base-pack',
        id: 'ypwqr45jmto2795w8d511zqy'
      },
      {
        text: 'A morte térmica inevitável do universo.',
        packId: 'base-pack',
        id: 'ef1i28p9gdmrthmufv3ycayb'
      },
      {
        text: 'A mão invisível.',
        packId: 'base-pack',
        id: 'wo9l4ee37x7mmr4ofjkz0xyn'
      },
      {
        text: 'Os judeus.',
        packId: 'base-pack',
        id: 'wgfjnk4ph2dypybe4akzuugf'
      },
      { text: 'O KKK.', packId: 'base-pack', id: 'yrxsadw7ym07hbrp7bfl2xwe' },
      {
        text: 'O Homem Kool-Aid.',
        packId: 'base-pack',
        id: 'v0a5qswjg45atb45otyz6m55'
      },
      {
        text: 'A terra do chocolate.',
        packId: 'base-pack',
        id: 'veztj9lqplt4wo70zcc6wmq2'
      },
      {
        text: 'A luz de um bilhão de sóis.',
        packId: 'base-pack',
        id: 'ccm2lmy9jmq74pikgw92p5rs'
      },
      {
        text: 'A Pequena Locomotiva que Podia.',
        packId: 'base-pack',
        id: 'zd1rz0kimmx6xvbdju726cl1'
      },
      {
        text: 'A magia do teatro ao vivo.',
        packId: 'base-pack',
        id: 'dq551kmbg19zdqvik66llpgu'
      },
      {
        text: 'A Fundação Make-A-Wish.',
        packId: 'base-pack',
        id: 'u7ggv11nk42dy58em1alcf6n'
      },
      {
        text: 'A Fundação Make-A-Wish.',
        packId: 'base-pack',
        id: 'c9qviw33rivzrsinhceqtq1o'
      },
      {
        text: 'O leiteiro.',
        packId: 'base-pack',
        id: 'sg36qyksnrc6bf86kc0yqql8'
      },
      {
        text: 'O leiteiro.',
        packId: 'base-pack',
        id: 'o3ebwsdicjoi1mbjrhvyua8k'
      },
      {
        text: 'O milagre do parto.',
        packId: 'base-pack',
        id: 'z866ntrqrtub77e0qs8uapl3'
      },
      {
        text: 'Os morbidamente obesos.',
        packId: 'base-pack',
        id: 'qnfz4z7e2ur0f9xfdw5jawx8'
      },
      { text: 'O Norte.', packId: 'base-pack', id: 'wumxmzsjpdbwp7189f5pqdyb' },
      {
        text: 'A Lei de Línguas Oficiais. La Loi sur les langues officielles.',
        packId: 'base-pack',
        id: 'nodyqvyf3mw71817eo9h6jr5'
      },
      {
        text: 'A única pessoa gay em cem quilômetros.',
        packId: 'base-pack',
        id: 'fbvtz7ck8i6yl0soad6id105'
      },
      {
        text: 'A única pessoa gay em cem milhas.',
        packId: 'base-pack',
        id: 'ji91vaa06n3ryx539esj4xgy'
      },
      {
        text: 'A epidemia de opioides.',
        packId: 'base-pack',
        id: 'zx7aexnll7keg42as86u5ros'
      },
      {
        text: 'O passado.',
        packId: 'base-pack',
        id: 'y3gru2m7e4gadksh74hf42sa'
      },
      {
        text: 'O Patriarcado.',
        packId: 'base-pack',
        id: 'm07wowtjmlplbs7nxklrxu9p'
      },
      {
        text: 'O solo do apito de uva de "My Heart Will Go On".',
        packId: 'base-pack',
        id: 'olm4qhcvb5zxmaosut0sgrli'
      },
      {
        text: 'O Elbow do Povo.',
        packId: 'base-pack',
        id: 'agedqfkmgx46xu43lqneu4wx'
      },
      {
        text: 'As pequenas tribulações da nobreza terráquea.',
        packId: 'base-pack',
        id: 'gh8yw34ha0v2yqhplms03tvq'
      },
      {
        text: 'A vida de pirata.',
        packId: 'base-pack',
        id: 'yjea4ltafcbkfek5rpwprs7t'
      },
      {
        text: 'A placenta.',
        packId: 'base-pack',
        id: 'ovgjg2dlbczfqvg32yta7brw'
      },
      {
        text: 'O enredo de um filme de Michael Bay.',
        packId: 'base-pack',
        id: 'bt9rowr120etq7z2nso8sqc6'
      },
      { text: 'O Papa.', packId: 'base-pack', id: 'i0051tkos9mqafo7yp9pikw7' },
      {
        text: 'Os gravemente deficientes.',
        packId: 'base-pack',
        id: 'jkd2jbk14skro2m3u2zcf9tc'
      },
      {
        text: 'As ameixas secas que eu estive guardando para você em minhas axilas.',
        packId: 'base-pack',
        id: 'h4qyki0ggzzh8pb6wyyi5c5v'
      },
      {
        text: 'O Arrebatamento.',
        packId: 'base-pack',
        id: 'mjeqn86k7n2dc648uurvo2il'
      },
      {
        text: 'Os Red Hot Chili Peppers.',
        packId: 'base-pack',
        id: 'glzkalqdlwraajd6lqfz1laq'
      },
      {
        text: 'O Perigo Vermelho.',
        packId: 'base-pack',
        id: 'pos61cpmy53yoc2upbpqe8o2'
      },
      {
        text: 'O Rev. Dr. Martin Luther King, Jr.',
        packId: 'base-pack',
        id: 'd5it34kivqr8th085xjz8wtt'
      },
      {
        text: 'Os ritmos da África.',
        packId: 'base-pack',
        id: 'fo31ctxs7ry734dopan6e653'
      },
      {
        text: 'A Polícia Montada do Canadá.',
        packId: 'base-pack',
        id: 'gkduzfdqy4zyzcos64wbaci3'
      },
      {
        text: 'Os russos.',
        packId: 'base-pack',
        id: 'bmwg8ymszfhljotrw4r4m420'
      },
      {
        text: 'Os Escoteiros.',
        packId: 'base-pack',
        id: 'zj2iql450wbx2l6m34bskkxb'
      },
      {
        text: 'Os gritos... os terríveis gritos.',
        packId: 'base-pack',
        id: 'jc1nyr0uzcsis1swnfc1y1pk'
      },
      {
        text: 'O Cheiro de Primark.',
        packId: 'base-pack',
        id: 'b3ttk2z0gah46dste2bhm3js'
      },
      { text: 'O Sul.', packId: 'base-pack', id: 'capsi8ij7ngdo37dotdtrfhx' },
      { text: 'O Stig.', packId: 'base-pack', id: 'mvfgtu23pa5ya06dfsmgvjah' },
      {
        text: 'A final da temporada de Strictly Come Dancing.',
        packId: 'base-pack',
        id: 'tevmfgwu3uk72jj6lg4nsixl'
      },
      {
        text: 'Take-backsies.',
        packId: 'base-pack',
        id: 't2qtqnvg10c5rgyrff5qry83'
      },
      {
        text: 'Levar um minuto para realmente entender o que Shakespeare está querendo dizer nesta cena.',
        packId: 'base-pack',
        id: 'x0gj2bu6vn8ypn4l5kdxx39w'
      },
      {
        text: 'Levar uma esposa-ovelha.',
        packId: 'base-pack',
        id: 'wxftoqlcpxkb23c46sbapr53'
      },
      {
        text: 'Tirar sua camisa.',
        packId: 'base-pack',
        id: 'cig9y6n5m81sqpbtg6icoypb'
      },
      {
        text: 'Slinkys emaranhados.',
        packId: 'base-pack',
        id: 'cogg1l46q4slsjmtu947qwa0'
      },
      {
        text: 'Sapateado como se não houvesse amanhã.',
        packId: 'base-pack',
        id: 'a9gcaf5aikwtdqywqqvsg3ru'
      },
      {
        text: 'Decote lateral elegante.',
        packId: 'base-pack',
        id: 'wmdiur2jc0sgf68ygiofjwm3'
      },
      {
        text: 'Ensinar um robô a amar.',
        packId: 'base-pack',
        id: 'ik2k8sjq2axlz7cux8xw4hq6'
      },
      {
        text: 'Exercícios de construção de equipe.',
        packId: 'base-pack',
        id: 'soo31d4ls6witcawbsk1w5le'
      },
      {
        text: 'Exercícios de construção de equipe.',
        packId: 'base-pack',
        id: 'fdax8a7v0d4t1ccbjihj0lm0'
      },
      {
        text: 'Rasgando aquela bunda como papel de embrulho na manhã de Natal.',
        packId: 'base-pack',
        id: 'u2ihl3oocks73keyc4oomsyb'
      },
      {
        text: 'Gravidez na adolescência.',
        packId: 'base-pack',
        id: 'y7t6fdgjx75x38owr1o5dzkx'
      },
      {
        text: 'Contar uma história ruim que não leva a lugar nenhum.',
        packId: 'base-pack',
        id: 'fgt1wgh7mtjwzajcxuxglunb'
      },
      {
        text: 'Pornô de tentáculos.',
        packId: 'base-pack',
        id: 'eqgn5y8jow8pkpvr3a3jehch'
      },
      {
        text: 'Terroristas.',
        packId: 'base-pack',
        id: 'hkokj47apyvpz65o71ov0g9u'
      },
      {
        text: 'A perna protética de Terry Fox.',
        packId: 'base-pack',
        id: 'c8nwp9weu91cdmmrm9fvpo4t'
      },
      {
        text: 'Torsão testicular.',
        packId: 'base-pack',
        id: 'np6wfz805hvzt27yjuu9lbs8'
      },
      {
        text: 'Aquela família estranha que pensa que é "Segunda-feira de cibersexo".',
        packId: 'base-pack',
        id: 'su7qv4tk3gbokwn2b778f6h0'
      },
      {
        text: 'Aquele Teletubbie gay.',
        packId: 'base-pack',
        id: 'w5hi6955lc3tma714reyfzws'
      },
      {
        text: 'Aquela coisa que eletrocuta seus abdominais.',
        packId: 'base-pack',
        id: 'pq5kj9i2xr0ikp0po6goqlwo'
      },
      {
        text: 'O Sonho Americano.',
        packId: 'base-pack',
        id: 'bouuj4a5fqtx6kxox49fru2v'
      },
      {
        text: 'Os Amish.',
        packId: 'base-pack',
        id: 'u6gxndcf1mkirydbr0ljdoih'
      },
      {
        text: 'A chegada da pizza.',
        packId: 'base-pack',
        id: 'vmsvav2404683388wblljk52'
      },
      {
        text: 'A arte da sedução.',
        packId: 'base-pack',
        id: 't4oh7hem1mjund5nw6fm8shd'
      },
      {
        text: 'O bebê que arruinou minha vagina.',
        packId: 'base-pack',
        id: 'yvazmizhtozejqavlazvkbay'
      },
      {
        text: 'Final da temporada de The Bachelorette.',
        packId: 'base-pack',
        id: 'b1z4vjy1v6a12f6ujreyy0ma'
      },
      {
        text: 'O Big Bang.',
        packId: 'base-pack',
        id: 'n09ckeiauj55a6lh07rlwu1d'
      },
      {
        text: 'O grande buraco fudido na camada de ozônio.',
        packId: 'base-pack',
        id: 'tzrzfokmlwm1n9zou2waknmd'
      },
      {
        text: 'A Peste Negra.',
        packId: 'base-pack',
        id: 'fsddy9ydz9lq6qdoe2ll60k7'
      },
      {
        text: 'O Sangue de Cristo.',
        packId: 'base-pack',
        id: 'qubkp4ic302y77evf3e7twy7'
      },
      {
        text: 'Os malditos galeses.',
        packId: 'base-pack',
        id: 'xspnooztcj13rglvt9u0jor8'
      },
      { text: 'O BNP.', packId: 'base-pack', id: 'j3alr1ae5r4oagqune41ap2x' },
      {
        text: 'O bombardeio de Nagasaki.',
        packId: 'base-pack',
        id: 'hahtnqnjsmva9cc6zet6wvnh'
      },
      {
        text: 'As ereções dos idosos.',
        packId: 'base-pack',
        id: 'b5ecs3phtsmglbymsra04r2c'
      },
      {
        text: 'Os Escoteiros da América.',
        packId: 'base-pack',
        id: 'ajy5ozlpj2nwofjccdrzj600'
      },
      { text: 'A selva.', packId: 'base-pack', id: 'uqa4q64nsihdy0ij7sel3yb4' },
      {
        text: 'O Olhar do Ursinho Carinhoso.',
        packId: 'base-pack',
        id: 'bt1xu8kfmi205l91hfc8odue'
      },
      {
        text: 'A equipe de ginástica chinesa.',
        packId: 'base-pack',
        id: 'fhvoadkh2sjfedmtdtyvcf5w'
      },
      {
        text: 'O crônico.',
        packId: 'base-pack',
        id: 'koqj3pdr1mcqb9a44sudkcy3'
      },
      {
        text: 'O clitóris.',
        packId: 'base-pack',
        id: 'swsjgjkbvi62b1rasbxq5fe5'
      },
      {
        text: 'O frescor refrescante de Coca-Cola®.',
        packId: 'base-pack',
        id: 'lnvekn4ef9vsmn6bd2zp4z0w'
      },
      {
        text: 'O frescor refrescante da Pepsi.',
        packId: 'base-pack',
        id: 'y4l68jj0cd1bs9tm5cject6o'
      },
      {
        text: 'O frescor refrescante de Pepsi®.',
        packId: 'base-pack',
        id: 'dj9l59dn0mkkj1vp09mwqpop'
      },
      {
        text: 'O sexo selvagem e estalado que seus pais estão fazendo agora mesmo.',
        packId: 'base-pack',
        id: 'jq0nlhr4xaqq6mkitm39o81s'
      },
      {
        text: 'O Daily Mail.',
        packId: 'base-pack',
        id: 'a8x11gnzkle1a68djcclxlhx'
      },
      {
        text: 'O Dalai Lama.',
        packId: 'base-pack',
        id: 'v4ts9t8sm4n6s0r8gxi1t4u6'
      },
      {
        text: 'A Dança da Fada Açucarada.',
        packId: 'base-pack',
        id: 'ehmisn794fst3ydg4e41kt60'
      },
      {
        text: 'Os deformados.',
        packId: 'base-pack',
        id: 'ubw9c2hzpkuyknspctpbkwg9'
      },
      {
        text: 'O Próprio Diabo.',
        packId: 'base-pack',
        id: 'td9www7of6kveoo1l3287007'
      },
      {
        text: 'O Selo de Aprovação do Donald Trump.™',
        packId: 'base-pack',
        id: 'fqpjlm58m2squu3ql2wqigcr'
      },
      {
        text: 'O clube de teatro.',
        packId: 'base-pack',
        id: 'dcd3blsp667n8ec9fw9gpdfn'
      },
      {
        text: 'A economia.',
        packId: 'base-pack',
        id: 'gsw4tgt42tr0pv2ivb1mi3c3'
      },
      { text: 'O EDL.', packId: 'base-pack', id: 'gnx52ourq5cpc9qity6gn091' },
      {
        text: 'O fim dos tempos.',
        packId: 'base-pack',
        id: 'lkmjlugrzi2umvnarahz2ihi'
      },
      {
        text: 'Todo o elenco de Downton Abbey.',
        packId: 'base-pack',
        id: 'y6piuhkru798jq50q9z33w96'
      },
      {
        text: 'Todo o Coral Tabernáculo Mórmon.',
        packId: 'base-pack',
        id: 'g5xvuyap2p7ogl5eh37x9tqm'
      },
      {
        text: 'Todo o Coral Tabernáculo Mórmon.',
        packId: 'base-pack',
        id: 'ni5igck1dzyzblrbxttotms4'
      },
      {
        text: 'O orgasmo feminino.',
        packId: 'base-pack',
        id: 'ii1j2fxnlymrplnyjr44rx9c'
      },
      { text: 'O FLQ.', packId: 'base-pack', id: 'ahj5fvsafr883yw5sylkoie4' },
      {
        text: 'A flauta.',
        packId: 'base-pack',
        id: 'nggmxysi97i2v3ibvbm0fk3a'
      },
      {
        text: 'A loucura do homem.',
        packId: 'base-pack',
        id: 'ycgh91474ifenlqv8s51lnoq'
      },
      {
        text: 'A fruta proibida.',
        packId: 'base-pack',
        id: 'ui5axjtw88hf8aibooxuapew'
      },
      { text: 'A Força.', packId: 'base-pack', id: 'knwctzvgy5vdt65apf0w7cjj' },
      {
        text: 'Os franceses.',
        packId: 'base-pack',
        id: 'o7h2e763dj6tjk0s5e67e55u'
      },
      { text: 'Os gays.', packId: 'base-pack', id: 'ojfe13bzqzzv7zw5ic67lw49' },
      {
        text: 'O teto de vidro.',
        packId: 'base-pack',
        id: 'xu7tnlatfvcj5wezfqiszuan'
      },
      {
        text: 'A Grande Depressão.',
        packId: 'base-pack',
        id: 'qrn4kc4lwh8n0dirvgvjpgmq'
      },
      {
        text: 'A Grande Guerra do Emu.',
        packId: 'base-pack',
        id: 'dxl6kk7vs639ezxfokychcc6'
      },
      {
        text: 'Os Gulags.',
        packId: 'base-pack',
        id: 'hiywc73dglp1hky9phh7ml2k'
      },
      {
        text: 'Os caras de Queer Eye.',
        packId: 'base-pack',
        id: 'tl1juxc15t8yzqarpshy3mxn'
      },
      {
        text: 'O Hamburglar.',
        packId: 'base-pack',
        id: 'k20yxmpc0a3qc0jcqommalkl'
      },
      {
        text: 'O trabalhador mexicano esforçado.',
        packId: 'base-pack',
        id: 'gaxzl9pqycllc69l569hdyro'
      },
      {
        text: 'o calor de uma cama luxuosa',
        packId: 'base-pack',
        id: 'z4a4jeax0b6v0laof9z5rzm7'
      },
      {
        text: 'Os irmãos Hemsworth.',
        packId: 'base-pack',
        id: 'de4ycax6fnqcn59meig878h6'
      },
      {
        text: 'O soluço.',
        packId: 'base-pack',
        id: 'dfyd2mezm74ijlgrh7pb3dk3'
      },
      {
        text: 'O Desastre de Hillsborough.',
        packId: 'base-pack',
        id: 'm5w4ah1tpi8nweo7redak0kr'
      },
      {
        text: 'A Bíblia Sagrada.',
        packId: 'base-pack',
        id: 'gaxvjko6r2kx6y62r8njtt76'
      },
      {
        text: 'A agenda homossexual.',
        packId: 'base-pack',
        id: 'b19so3aahg2swvyr2tka8xpr'
      },
      {
        text: 'O estilo de vida homossexual.',
        packId: 'base-pack',
        id: 'rpwxts29nfydz0xei4jcz82m'
      },
      {
        text: 'O Monstro do Mel.',
        packId: 'base-pack',
        id: 'rkl4jz1fzhpp2h48ufh1cn84'
      },
      {
        text: 'A Centopeia Humana: edição infinita.',
        packId: 'base-pack',
        id: 'p06fbdq7beye8u0nj8h4r1ht'
      },
      {
        text: 'A Hustle.',
        packId: 'base-pack',
        id: 'kn2tksr8i538kh3fkful98wm'
      },
      {
        text: 'A ilusão de escolha em uma sociedade capitalista avançada.',
        packId: 'base-pack',
        id: 'mbi935n1qrsarxcv7am61xtr'
      },
      {
        text: 'A morte térmica inevitável do universo.',
        packId: 'base-pack',
        id: 'e3ie1ccgv1ekcomusco5c54y'
      },
      {
        text: 'A mão invisível.',
        packId: 'base-pack',
        id: 'zysfum1bi5pmx9qt6ziapjha'
      },
      {
        text: 'Os judeus.',
        packId: 'base-pack',
        id: 'xhckpvgxv6zafaxdjoac2to3'
      },
      { text: 'O KKK.', packId: 'base-pack', id: 'lyce820hvbvx0tfb3uim2mhs' },
      {
        text: 'O Homem Kool-Aid.',
        packId: 'base-pack',
        id: 'gcy3nasgo37gyww27tsxlr1b'
      },
      {
        text: 'A terra do chocolate.',
        packId: 'base-pack',
        id: 'd5krnpm0kott99sm0heeqzlf'
      },
      {
        text: 'A luz de um bilhão de sóis.',
        packId: 'base-pack',
        id: 'hyw6v8ovfjwlisksj92zmjvo'
      },
      {
        text: 'A Pequena Locomotiva que Podia.',
        packId: 'base-pack',
        id: 'nxs0twkggrdge433wz1bu0av'
      },
      {
        text: 'A magia do teatro ao vivo.',
        packId: 'base-pack',
        id: 'wz76haitvv7p6pg65ljnnppa'
      },
      {
        text: 'A Fundação Make-A-Wish.',
        packId: 'base-pack',
        id: 'skzgprrxpzldvpxpdt3md4e9'
      },
      {
        text: 'A Fundação Make-A-Wish.',
        packId: 'base-pack',
        id: 'johwt3u203v2z6ooa0wr5h6y'
      },
      {
        text: 'O leiteiro.',
        packId: 'base-pack',
        id: 'umac1zltuhktgo3cm50va30s'
      },
      {
        text: 'O leiteiro.',
        packId: 'base-pack',
        id: 'undi4i5lycs828lpc22uv291'
      },
      {
        text: 'O milagre do parto.',
        packId: 'base-pack',
        id: 'rp53ak41kg8rtpepswsz9agk'
      },
      {
        text: 'Os morbidamente obesos.',
        packId: 'base-pack',
        id: 'qz9o95846r8b70de15b2wcsp'
      },
      { text: 'O Norte.', packId: 'base-pack', id: 'y05t86dzldaavtyd959h7u1y' },
      {
        text: 'A Lei de Línguas Oficiais. La Loi sur les langues officielles.',
        packId: 'base-pack',
        id: 'pt2qodymd0j7tjxmhh6pnwr8'
      },
      {
        text: 'A única pessoa gay em cem quilômetros.',
        packId: 'base-pack',
        id: 'vb21ogdqlknlwb6ia50f1422'
      },
      {
        text: 'A única pessoa gay em cem milhas.',
        packId: 'base-pack',
        id: 'nwy1gfzvor6wp2wtwrtlxb54'
      },
      {
        text: 'A epidemia de opioides.',
        packId: 'base-pack',
        id: 'ecu0exgsqgblvh9w3dlsjltu'
      },
      {
        text: 'O passado.',
        packId: 'base-pack',
        id: 'tlcnhbxf1iq1xa0imtgaq56f'
      },
      {
        text: 'O Patriarcado.',
        packId: 'base-pack',
        id: 'mmgqw2ev4ikmykb7iezrigt9'
      },
      {
        text: 'O solo do apito de uva de "My Heart Will Go On".',
        packId: 'base-pack',
        id: 'qpvj3axvroiycmzmwdnvrvzx'
      },
      {
        text: 'O Elbow do Povo.',
        packId: 'base-pack',
        id: 'ftkzt6n506d3zrm4zf5h31ew'
      },
      {
        text: 'As pequenas tribulações da nobreza terráquea.',
        packId: 'base-pack',
        id: 'cuel9gspt0jvklau4zab96f8'
      },
      {
        text: 'A vida de pirata.',
        packId: 'base-pack',
        id: 'sqcuaciseaah5bvzlgrt3ix2'
      },
      {
        text: 'A placenta.',
        packId: 'base-pack',
        id: 'dkin5s4ue1f1v741f0n73s0w'
      },
      {
        text: 'O enredo de um filme de Michael Bay.',
        packId: 'base-pack',
        id: 'pebqi62462s0hkuciockzxt0'
      },
      { text: 'O Papa.', packId: 'base-pack', id: 'ls3tsy1czaf6gq0mivax5sk7' },
      {
        text: 'Os gravemente deficientes.',
        packId: 'base-pack',
        id: 'fdhgsgdkqntwgcqnlqrrw0tw'
      },
      {
        text: 'As ameixas secas que eu estive guardando para você em minhas axilas.',
        packId: 'base-pack',
        id: 'dhtibxfluvuyx9ppmio9td0c'
      },
      {
        text: 'O Arrebatamento.',
        packId: 'base-pack',
        id: 'z7n9cepv6gylv01on3x6tqc1'
      },
      {
        text: 'Os Red Hot Chili Peppers.',
        packId: 'base-pack',
        id: 'n6r6qnqlh1evs9mg2spw5x2g'
      },
      {
        text: 'O Perigo Vermelho.',
        packId: 'base-pack',
        id: 'ba2f99s502vymh4nrprbgntb'
      },
      {
        text: 'O Rev. Dr. Martin Luther King, Jr.',
        packId: 'base-pack',
        id: 'pdj98ukesuqzq0xpzwt3nzn9'
      },
      {
        text: 'Os ritmos da África.',
        packId: 'base-pack',
        id: 'ov3c7iokm9birrj2ku2otart'
      },
      {
        text: 'A Polícia Montada do Canadá.',
        packId: 'base-pack',
        id: 'bcrniao82ow9y1v8wx85vbop'
      },
      {
        text: 'Os russos.',
        packId: 'base-pack',
        id: 'pbihdcbi08dpmjptytqd5hd7'
      },
      {
        text: 'Os Escoteiros.',
        packId: 'base-pack',
        id: 'dmbyl80h8pcs5vp8mf6u19oh'
      },
      {
        text: 'Os gritos... os terríveis gritos.',
        packId: 'base-pack',
        id: 'gm9zsqu29upxxqh0kl8r6a2p'
      },
      {
        text: 'O Cheiro de Primark.',
        packId: 'base-pack',
        id: 'dwlrj39to4emey5vzcf9pzri'
      },
      { text: 'O Sul.', packId: 'base-pack', id: 'itzm7g3kp6x4p7osxkl14le7' },
      { text: 'O Stig.', packId: 'base-pack', id: 'ggvwv6g76ag7xc1mbw7mdfnx' },
      {
        text: 'A final da temporada de Strictly Come Dancing.',
        packId: 'base-pack',
        id: 'aw05q7otgpvv1d4lo1rczq6m'
      },
      {
        text: 'A aparição repentina do homem do Go Compare.',
        packId: 'base-pack',
        id: 'yeu9s3b3bmya0aqgdiv0laps'
      },
      {
        text: 'O Superdome.',
        packId: 'base-pack',
        id: 'pkihrunzv9vgreuays5syii7'
      },
      {
        text: 'O períneo; o grude; a ponte de diversão carnuda.',
        packId: 'base-pack',
        id: 'oqphqceidh2o4kikdu81hyso'
      },
      {
        text: 'O Sistema de Sono Sueco Tempur-Pedic®.',
        packId: 'base-pack',
        id: 'gx8h5tlbk79is1zdwq0tedl0'
      },
      {
        text: 'Os terroristas.',
        packId: 'base-pack',
        id: 'ojh2js94xvhk0kvtcwskaaux'
      },
      {
        text: 'A Música do Fio Dental.',
        packId: 'base-pack',
        id: 'xcre9xaaayq7sd43ltoagdw5'
      },
      {
        text: 'O compromisso de três quintos.',
        packId: 'base-pack',
        id: 'pmrfjdigy8iz0p0rrlp4w9b0'
      },
      {
        text: 'O compromisso de três quintos.',
        packId: 'base-pack',
        id: 'stitxonc8o0nmlrfr55r30y3'
      },
      {
        text: 'A minoria representativa.',
        packId: 'base-pack',
        id: 'djy2lf3882j43jfuso2uzm28'
      },
      {
        text: 'O colapso total do sistema financeiro global.',
        packId: 'base-pack',
        id: 'nou0myomvnw9n2cxz1kd3q6y'
      },
      {
        text: 'A Trilha das Lágrimas.',
        packId: 'base-pack',
        id: 'i1z6uw2qhy8jj3js76hauhu8'
      },
      {
        text: 'O verdadeiro significado do Natal.',
        packId: 'base-pack',
        id: 'j67tmcovxbswayyhapbpvb9p'
      },
      {
        text: 'O Übermensch.',
        packId: 'base-pack',
        id: 'k43z4uc92bcgdecfbcq9f4fk'
      },
      {
        text: 'A Ferrovia Clandestina.',
        packId: 'base-pack',
        id: 'bhmi5fld864natoeefu0ve4v'
      },
      {
        text: 'A maré imparável do Islã.',
        packId: 'base-pack',
        id: 'ayh6kbfzka0qd0gegqcw08zc'
      },
      {
        text: 'A violação de nossos direitos humanos mais básicos.',
        packId: 'base-pack',
        id: 'iurtkt679c25pwenm5bl2lbw'
      },
      {
        text: 'O Massacre de Virginia Tech.',
        packId: 'base-pack',
        id: 'c64iugdjgalc0ykqxooifg3i'
      },
      {
        text: 'O tratamento de James Bond com as mulheres.',
        packId: 'base-pack',
        id: 'pa7uhw5dmp5hieyj79yuj6e2'
      },
      {
        text: 'A Política da Austrália Branca.',
        packId: 'base-pack',
        id: 'psrdkal8wks82651vrg6vinb'
      },
      {
        text: 'A senha do wifi.',
        packId: 'base-pack',
        id: 'yrhrd7xfw6mobs3cbi120kva'
      },
      {
        text: 'As maravilhas do Oriente.',
        packId: 'base-pack',
        id: 'r4ntmps1v86f9hfiol5agefu'
      },
      {
        text: 'O Mundo de Warcraft.',
        packId: 'base-pack',
        id: 'xbmovxjaxwn6ki5brfvz23m3'
      },
      {
        text: 'A fúria de Vladimir Putin.',
        packId: 'base-pack',
        id: 'xrj16ogq609ra14plagdx2d8'
      },
      { text: 'Terapia.', packId: 'base-pack', id: 'zseohmawxbx4577yl64yvr5j' },
      {
        text: 'Theresa May.',
        packId: 'base-pack',
        id: 'hwwlthmv9tncx2o4au5sop10'
      },
      {
        text: 'Essas vadias.',
        packId: 'base-pack',
        id: 'xfhzkshnjz91mx9zjh9v9si4'
      },
      {
        text: 'Terceira base.',
        packId: 'base-pack',
        id: 'hqwhq6am48odeklalhgxz8b7'
      },
      {
        text: 'Esta resposta é pós-moderna.',
        packId: 'base-pack',
        id: 'cbg6rraqzt5e139ikywstleq'
      },
      {
        text: 'Tiroteio em massa deste mês.',
        packId: 'base-pack',
        id: 'j9gprtw5v4gy4fzjj9jq4z9z'
      },
      {
        text: 'Tiroteio em massa deste ano.',
        packId: 'base-pack',
        id: 'faiub940jw7krl0j7f5o425m'
      },
      {
        text: 'Aquelas vezes em que você fica com areia na vagina.',
        packId: 'base-pack',
        id: 't3hy42ssaeayxek468xpx7eh'
      },
      {
        text: 'Três paus ao mesmo tempo.',
        packId: 'base-pack',
        id: 'vtw285mnoht2zkgogcnwl9ex'
      },
      {
        text: 'Jogar uma virgem em um vulcão.',
        packId: 'base-pack',
        id: 'mgbo0lkv2t66m6huw18sai49'
      },
      {
        text: 'Jogar uvas em um homem até que ele perca contato com a realidade.',
        packId: 'base-pack',
        id: 'rvsqgtwddxep356zye4ibvtw'
      },
      {
        text: 'Tickle Me Elmo.',
        packId: 'base-pack',
        id: 'whxtoq4h9kfb4ojj64nn4jvb'
      },
      {
        text: 'Tickle Me Elmo™.',
        packId: 'base-pack',
        id: 'qzeb8e1j2i3g3u23a5qixl3w'
      },
      {
        text: 'Cosquinhar Sean Hannity, mesmo depois que ele te pede para parar.',
        packId: 'base-pack',
        id: 'mdw1lb6r27h3s85nkigha8jw'
      },
      {
        text: 'Tiger Woods.',
        packId: 'base-pack',
        id: 'bx42o714mr27y1md03ddy4fs'
      },
      {
        text: 'Terroristas pequenininhos.',
        packId: 'base-pack',
        id: 'qy1ym9e2kw8mraiwz484c8lc'
      },
      {
        text: 'Tom Cruise.',
        packId: 'base-pack',
        id: 'lvdzr2fdmkegupihdblyi1yt'
      },
      {
        text: 'Lamber um cu de balão de nós.',
        packId: 'base-pack',
        id: 'yjwneuo75xdoo2d6tikwtsn3'
      },
      {
        text: 'Vagina de Toni Morrison.',
        packId: 'base-pack',
        id: 'd7nsjo5zx5d2hjeyhmk2ik8v'
      },
      {
        text: 'Tony Abbott de sunga.',
        packId: 'base-pack',
        id: 'e3zxno6dx2tov5e983zxbo51'
      },
      {
        text: 'Muito gel de cabelo.',
        packId: 'base-pack',
        id: 'cb58rs2qnh6jghikzf0zjjeh'
      },
      { text: 'Tories.', packId: 'base-pack', id: 'y47ez168nvny9sl6fdtq6lsn' },
      {
        text: 'Controle total da mídia.',
        packId: 'base-pack',
        id: 'dzyovkq71l2btlqdh5vzj0i3'
      },
      {
        text: 'Tocar um pug bem no pênis dele.',
        packId: 'base-pack',
        id: 'gtr71sr9of9ia4edq62cnnj1'
      },
      {
        text: 'Pé de trincheira.',
        packId: 'base-pack',
        id: 'wfdth41lmij9jmr56s8tp58q'
      },
      {
        text: 'Ver coisas estranhas.',
        packId: 'base-pack',
        id: 'gkz2gdez978ag32ap3gv5l85'
      },
      { text: 'Tweetar.', packId: 'base-pack', id: 'm92u8u5oi1th0uf6a4l421xm' },
      {
        text: 'Vinte toneladas de merda de morcego.',
        packId: 'base-pack',
        id: 'aojycrrtrz9zgd53o4khoikj'
      },
      {
        text: 'Twinkies®.',
        packId: 'base-pack',
        id: 'o2pwu4qa2ze68pvftnfqtm2c'
      },
      {
        text: 'Dois anões cagando em um balde.',
        packId: 'base-pack',
        id: 'ywmepb3tpl1f5353vqrzv7xz'
      },
      {
        text: 'Estupidez incompreensível.',
        packId: 'base-pack',
        id: 'm5dh8y8r5m9tsac9dcqpseo4'
      },
      {
        text: 'Golpes de direita.',
        packId: 'base-pack',
        id: 'e62pm8y5my3z0kw18r9ziprn'
      },
      {
        text: 'Calcinhas usadas.',
        packId: 'base-pack',
        id: 'simafv7qmjqtullov3weivms'
      },
      {
        text: 'Calcinhas usadas.',
        packId: 'base-pack',
        id: 'ntrc775o7khkfw0ujhanu16d'
      },
      {
        text: 'Vegemite™.',
        packId: 'base-pack',
        id: 'un7u6dmon1at6gy9zju8h6a9'
      },
      {
        text: 'Homicídio veicular.',
        packId: 'base-pack',
        id: 'fbcbr6f7a4uiovp7hu784ona'
      },
      {
        text: 'Homicídio veicular.',
        packId: 'base-pack',
        id: 's1ga37qsuve4lz94gdqyytwb'
      },
      { text: 'Viagra®.', packId: 'base-pack', id: 'blhhtaitrmjn4esag7uxx5lh' },
      {
        text: 'Justiça vigilante.',
        packId: 'base-pack',
        id: 'qhyuk02p2sgnom83l4zawqz8'
      },
      {
        text: 'Mãos jazz vigorosas.',
        packId: 'base-pack',
        id: 'i5aeapm06h4kf5n0a71a24g8'
      },
      { text: 'Vikings.', packId: 'base-pack', id: 'ppe69hhgtzxr1oi77ryyos70' },
      {
        text: 'Vladimir Putin.',
        packId: 'base-pack',
        id: 'h0rruqmaqhqu3tul2u7luhca'
      },
      {
        text: 'Vomitando no marsupial de um canguru.',
        packId: 'base-pack',
        id: 'xkj77gtmbu7aatp2svryz5qg'
      },
      {
        text: 'Vomitando frutos do mar e sangrando analmente.',
        packId: 'base-pack',
        id: 'd0auvyae7qgkp5m8d4gfz5b6'
      },
      {
        text: 'Vomitando frutos do mar e sangrando analmente.',
        packId: 'base-pack',
        id: 'zhjhnl8xwm8f5087aek5qbwb'
      },
      {
        text: 'Esperar até o casamento.',
        packId: 'base-pack',
        id: 'qp7ykpf7m5tpzovy00yk3936'
      },
      {
        text: 'Esperar até o casamento.',
        packId: 'base-pack',
        id: 'su3e3rn8l2j3qah3dmr7vmai'
      },
      {
        text: "Acordar seminu em um estacionamento do Denny's.",
        packId: 'base-pack',
        id: 'wvyvmj3e6hynrri5sd2rfhgl'
      },
      {
        text: 'Acordar seminu em um estacionamento do Little Chef.',
        packId: 'base-pack',
        id: 'w3hv0ct69jmzi4dvx4tn23g8'
      },
      {
        text: "Acordar seminu em um estacionamento do Macca's.",
        packId: 'base-pack',
        id: 'vdd6h6vpmi6c43cao5iuvbw4'
      },
      {
        text: 'Acordar nos braços de Idris Elba.',
        packId: 'base-pack',
        id: 'r7bsv4f452qrcp5n51dhbqlg'
      },
      {
        text: 'Flagrar o pai urinando na boca da mãe.',
        packId: 'base-pack',
        id: 'cpp83eo9db0ch8scvorpwsp3'
      },
      {
        text: 'Masturbar-se em uma piscina de lágrimas de crianças.',
        packId: 'base-pack',
        id: 'eibdlefuksncuxbrfrtvp6uu'
      },
      {
        text: 'Waterboarding.',
        packId: 'base-pack',
        id: 'joyzyuj1y4oxemf2u5x1gik6'
      },
      {
        text: 'Passar batom no meu ânus.',
        packId: 'base-pack',
        id: 'njbsar10grzhe9vqv64wh9g3'
      },
      {
        text: 'Usar roupas íntimas azuis sob a túnica da Klan.',
        packId: 'base-pack',
        id: 'uj66fccvtcx0ppxdxg6l3qrs'
      },
      {
        text: 'Usar roupas íntimas ao avesso para evitar lavar roupa.',
        packId: 'base-pack',
        id: 'n9ncth8qag1637b25zwynsg5'
      },
      {
        text: 'Usar roupas íntimas ao avesso para evitar lavar roupa.',
        packId: 'base-pack',
        id: 'yf1zbsr9t1nu978757kdynh5'
      },
      {
        text: 'Sonhos molhados.',
        packId: 'base-pack',
        id: 'qmiyvurqe58h5mb8bqirbx6e'
      },
      {
        text: 'O que essa boca faz.',
        packId: 'base-pack',
        id: 'gpw9u5r0yo7cghv6f0qbpr08'
      },
      {
        text: 'O que restou da Grande Barreira de Corais.',
        packId: 'base-pack',
        id: 'rggr9vgx0q7bv6qnvdzkr4t9'
      },
      {
        text: 'Quando você solta um peido e sai um pouco de cocô.',
        packId: 'base-pack',
        id: 'd0s427lzublcm6xg50xp8xqo'
      },
      {
        text: 'Choramingar até conseguir o que quer.',
        packId: 'base-pack',
        id: 'ujcg36qmmw8lqqd5949x5e86'
      },
      {
        text: 'Colocando para fora.',
        packId: 'base-pack',
        id: 'i1t351ytaa04lopdkgmavkb1'
      },
      {
        text: 'Leite para gatos Whiskas®.',
        packId: 'base-pack',
        id: 'a7ti503ps885068pm0fs7vsr'
      },
      {
        text: 'Pessoas brancas.',
        packId: 'base-pack',
        id: 'y8xhelwlvobre6hlgtivtdgr'
      },
      {
        text: 'Poder branco.',
        packId: 'base-pack',
        id: 'i59s0qnqxba2ubtogb3c53ai'
      },
      {
        text: 'Privilégio branco.',
        packId: 'base-pack',
        id: 'dlbgjd7k8w8d9c3mgdly6k27'
      },
      {
        text: 'Privilégio branco.',
        packId: 'base-pack',
        id: 'bwu6mpxx6uyber3l2zhy5n22'
      },
      {
        text: 'Escalpos de homens brancos.',
        packId: 'base-pack',
        id: 'lpusbggujecyrvqi5ixkbgig'
      },
      {
        text: 'Quem quer que seja o Primeiro Ministro atualmente.',
        packId: 'base-pack',
        id: 'i9g1t24thz3vpp9auvxgmnmg'
      },
      {
        text: 'Deveres de esposa.',
        packId: 'base-pack',
        id: 'kjgy6o7ukbwnh2uitb80bu3n'
      },
      {
        text: 'Will Smith.',
        packId: 'base-pack',
        id: 'pbf97t77mir83hcs4qxgxrtc'
      },
      {
        text: 'William Shatner.',
        packId: 'base-pack',
        id: 'u33o9cgv9ww56ba16sylw8yh'
      },
      {
        text: 'Piscando para pessoas idosas.',
        packId: 'base-pack',
        id: 'qndzuoaxp5nymen46hbbvpqn'
      },
      {
        text: 'Limpando o bumbum dela.',
        packId: 'base-pack',
        id: 'a2zzymu2wgtj6vsepu3thaw7'
      },
      {
        text: 'Limpando o bumbum dela.',
        packId: 'base-pack',
        id: 'v1azkwh8u1fgmc54mmgxx7ks'
      },
      {
        text: 'Música de mago.',
        packId: 'base-pack',
        id: 'oktgvi54c1yddxt9qnx8mbpj'
      },
      {
        text: 'Mulheres em propagandas de iogurte.',
        packId: 'base-pack',
        id: 'rqu4mlf3jzcrh9xozczilx82'
      },
      {
        text: 'Mulheres em propagandas de iogurte.',
        packId: 'base-pack',
        id: 'czp48dppagj9s281miw69wcl'
      },
      {
        text: 'Mulheres em propagandas de iogurte.',
        packId: 'base-pack',
        id: 'bsl5fyj6y1m2rrslus8i4sdv'
      },
      {
        text: 'Mulheres de cor.',
        packId: 'base-pack',
        id: 't1it7bst8ttpllv9w1oka6ix'
      },
      {
        text: 'Mulheres de cor.',
        packId: 'base-pack',
        id: 'zgn2i9sp43qfjy2xvkshvcfc'
      },
      {
        text: 'Mulheres votando.',
        packId: 'base-pack',
        id: 'ot5ebowvndy52ezir9yq6d2k'
      },
      {
        text: 'Roupas íntimas femininas.',
        packId: 'base-pack',
        id: 'yulqh80vrdqu5ppr6h2bclh0'
      },
      {
        text: 'Roupas íntimas femininas.',
        packId: 'base-pack',
        id: 'nggmswnl32snsxbe40ji4jrv'
      },
      {
        text: 'Perguntando se é possível levar um pouco daquela salsa para viagem.',
        packId: 'base-pack',
        id: 'fxtoq4p2flesffyjy8moqsjh'
      },
      {
        text: 'Palavras.',
        packId: 'base-pack',
        id: 'lmgd9l7l9yyw9h6hbprjuse1'
      },
      {
        text: 'Paz mundial.',
        packId: 'base-pack',
        id: 'criewa9dgk2o35ouyuhrdbwj'
      },
      {
        text: 'Adorando aquela vagina.',
        packId: 'base-pack',
        id: 'tltq70n1wbunut3ncnbzzmik'
      },
      {
        text: "Gritar 'ASSASSINOS DE BEBÊS' para botas em um terminal de aeroporto.",
        packId: 'base-pack',
        id: 'f6f9ehbd1ycww6qk4hzxaoae'
      },
      {
        text: 'VOCÊ DEVE CONSTRUIR PILÕES ADICIONAIS.',
        packId: 'base-pack',
        id: 'hy7hnp4zckteqq0xdo27e830'
      },
      { text: 'Sua mãe.', packId: 'base-pack', id: 'ket3tpar6rdc25zhi50no6vz' },
      {
        text: 'Seu irmão estranho.',
        packId: 'base-pack',
        id: 'bbvjr28rc9j7wz80mhzmb0bx'
      }
    ],
    black: [
      {
        text: '___ + ___ = Hipsters',
        pick: 2,
        packId: 'base-pack',
        id: 'blz0xfcj1a7gqyakc7e8gujs'
      },
      {
        text: '___ é um sinal certo do declínio da humanidade.',
        pick: 1,
        packId: 'base-pack',
        id: 'x7mog9f15paahnf93d2knuws'
      },
      {
        text: '___ só aconteceria nos meus piores pesadelos.',
        pick: 1,
        packId: 'base-pack',
        id: 'j845gq4whobg2nab0pyosptk'
      },
      {
        text: '___ : bom até a última gota.',
        pick: 1,
        packId: 'base-pack',
        id: 'vc5xxb4tc7rm26nrhhd53kc2'
      },
      {
        text: '___ : aprovado pelas crianças, aprovado pelas mães.',
        pick: 1,
        packId: 'base-pack',
        id: 'jmky53y20fyrzuohfcfpjbjr'
      },
      {
        text: '___ : aprovado pelas crianças, aprovado pelas mães.',
        pick: 1,
        packId: 'base-pack',
        id: 'wwvcal45wpslutalx4ne3vyd'
      },
      {
        text: '___ Uma vez que você experimenta, a diversão não para!',
        pick: 1,
        packId: 'base-pack',
        id: 'cqkkchf6ls0t3f0ua8m4dzyw'
      },
      {
        text: '? Ah, sim. Tem pornografia sobre isso.',
        pick: 1,
        packId: 'base-pack',
        id: 'mb584c4sh4xjl7dw7ksxsjde'
      },
      {
        text: '___ ? Existe um aplicativo para isso.',
        pick: 1,
        packId: 'base-pack',
        id: 'iqwltcaf5rvx8bt9qukxyxep'
      },
      {
        text: '___ ? Sim, não.',
        pick: 1,
        packId: 'base-pack',
        id: 'f6zqjgkxdi3bvuxg82utmmet'
      },
      {
        text: '___ . Incrível na teoria, mas meio bagunçado na prática.',
        pick: 1,
        packId: 'base-pack',
        id: 'oq3lee7gudc1xvfnw3zn4j1q'
      },
      {
        text: '___ . Aposto que você não consegue ter só um!',
        pick: 1,
        packId: 'base-pack',
        id: 'f1zqfp51160h6g9suql18hm1'
      },
      {
        text: '___ . Toca aqui, mano.',
        pick: 1,
        packId: 'base-pack',
        id: 'ciu57jt3tiwlq1hxk092vf4k'
      },
      {
        text: '___ . É uma armadilha!',
        pick: 1,
        packId: 'base-pack',
        id: 'haefo1elwhtk4yntxt4okbrt'
      },
      {
        text: '___ . Isso foi tão metal.',
        pick: 1,
        packId: 'base-pack',
        id: 'joepfoi4smaoa4jjvluj862b'
      },
      {
        text: '___ . É assim que eu quero morrer.',
        pick: 1,
        packId: 'base-pack',
        id: 'vqyvw372law7u29ostgkqz6r'
      },
      {
        text: '___ . A melhor maneira de apimentar sua vida sexual.',
        pick: 1,
        packId: 'base-pack',
        id: 'ghm8foxr26c8xj0mh98mfrqo'
      },
      {
        text: '★✰✰✰✰ Não vá aqui! Encontrei ___ no meu frango Kung Pao!',
        pick: 1,
        packId: 'base-pack',
        id: 'jmv8sftywf9jdrcib7no0l7v'
      },
      {
        text: '50% de todos os casamentos terminam em ___ .',
        pick: 1,
        packId: 'base-pack',
        id: 'jm6sosfng1ua2qyafavulpec'
      },
      {
        text: 'Um recente estudo de laboratório mostra que os universitários fazem 50% menos sexo depois de serem expostos a ___ .',
        pick: 1,
        packId: 'base-pack',
        id: 'nzzk7rf25zpm63ffg6uifku1'
      },
      {
        text: 'Um jantar romântico à luz de velas estaria incompleto sem ___ .',
        pick: 1,
        packId: 'base-pack',
        id: 'zcjitztsx0hzu6va17jeypvk'
      },
      {
        text: 'Um jantar romântico à luz de velas estaria incompleto sem ___ .',
        pick: 1,
        packId: 'base-pack',
        id: 'vmrfi33rbr234ufw6e429h5r'
      },
      {
        text: 'Um jantar romântico à luz de velas estaria incompleto sem ___ .',
        pick: 1,
        packId: 'base-pack',
        id: 'xvrfol5m6kqab407cc4udft5'
      },
      {
        text: 'Uma entrevista de emprego bem-sucedida começa com um firme aperto de mãos e termina com ___ .',
        pick: 1,
        packId: 'base-pack',
        id: 'wbs9og9yqyd6xtyhrk7lb38f'
      },
      {
        text: 'TV Globo apresenta: " ___ : A História de ___ ".',
        pick: 2,
        packId: 'base-pack',
        id: 'tmg692yfg0h4klxzntjabpe3'
      },
      {
        text: 'Após oito anos na Casa Branca, como o Obama finalmente está se soltando?',
        pick: 1,
        packId: 'base-pack',
        id: 'p1erhxcp7wqcx80x0t1dbnfj'
      },
      {
        text: 'Após quatro álbuns de platina e três Grammys, é hora de voltar às minhas raízes, ao que me inspirou a fazer música em primeiro lugar: ___ .',
        pick: 1,
        packId: 'base-pack',
        id: 'ytimd5ssiroxxsv8289ng0yp'
      },
      {
        text: 'Após o furacão Katrina, Sean Penn levou ___ a todas as pessoas de Nova Orleans.',
        pick: 1,
        packId: 'base-pack',
        id: 'pm8356rexeimqdeviyv323l5'
      },
      {
        text: 'Após o furacão Katrina, Sean Penn levou ___ ao povo de Nova Orleans.',
        pick: 1,
        packId: 'base-pack',
        id: 'wmmss7ucxjt66uga6so5zbxm'
      },
      {
        text: 'Depois de meses de prática com ___ , acho que estou finalmente pronto para ___ .',
        pick: 2,
        packId: 'base-pack',
        id: 'f1fe6ozvil873fmbb7mp6w9s'
      },
      {
        text: 'Após o terremoto, Sean Penn levou ___ ao povo do Haiti.',
        pick: 1,
        packId: 'base-pack',
        id: 'ydx56barzmrriw1n44ns2d8c'
      },
      {
        text: 'As diretrizes da Air Canada agora proíbem ___ em aviões.',
        pick: 1,
        packId: 'base-pack',
        id: 'j0naieuxnrvo5q2maayu4lom'
      },
      {
        text: 'As diretrizes de segurança do aeroporto agora proíbem ___ em aviões.',
        pick: 1,
        packId: 'base-pack',
        id: 'ga8hz3ihluuvwl95j1sgi480'
      },
      {
        text: 'A medicina alternativa agora está adotando os poderes curativos de ___ .',
        pick: 1,
        packId: 'base-pack',
        id: 'eg3z74a6ltmtfz9enj0sltxq'
      },
      {
        text: 'E o prêmio da Academia de ___ vai para ___ .',
        pick: 2,
        packId: 'base-pack',
        id: 'suurwofl8bhztzg4on2k30g0'
      },
      {
        text: 'E o prêmio BAFTA de ___ vai para ___ .',
        pick: 2,
        packId: 'base-pack',
        id: 'qgglb1f9604b6mjed1empuvt'
      },
      {
        text: 'E o que você trouxe para mostrar e contar?',
        pick: 1,
        packId: 'base-pack',
        id: 'b935mib9lqz43ce3przykwek'
      },
      {
        text: 'Antropólogos descobriram recentemente uma tribo primitiva que adora ___ .',
        pick: 1,
        packId: 'base-pack',
        id: 'n9bjo5x3n36ripdw2wb6uz6b'
      },
      {
        text: "Arby's: Nós temos ___.",
        pick: 1,
        packId: 'base-pack',
        id: 'rhsf4bi8cpg3gl64a82xhzqd'
      },
      {
        text: 'Você está pensando o que eu estou pensando, B1?\n\nAcho que sim, B2: é hora do ___ !',
        pick: 1,
        packId: 'base-pack',
        id: 'pl1xgpg434kodoxh5wg56l3q'
      },
      {
        text: 'Como minha resolução de Ano Novo, eu prometo desistir de ___ .',
        pick: 1,
        packId: 'base-pack',
        id: 'eyii653hxesu97tjen9bnvrh'
      },
      {
        text: 'Como mãe de cinco meninos agitados, eu não sou estranha a ___ .',
        pick: 1,
        packId: 'base-pack',
        id: 'kj9pdjvkk25ieyd9eq3vvmxy'
      },
      {
        text: 'Como mãe de cinco meninos agitados, eu não sou estranha a ___ .',
        pick: 1,
        packId: 'base-pack',
        id: 'lffvgmud2f6n3fq3avdd0ced'
      },
      {
        text: 'Aposto que você não consegue ter apenas um!',
        pick: 1,
        packId: 'base-pack',
        id: 'qcy0bh7uj66mjv1n1ufb8rsc'
      },
      {
        text: 'Aposto que você não consegue ter apenas um!',
        pick: 1,
        packId: 'base-pack',
        id: 'spfc4xf2m6cxooh5gb12pkvg'
      },
      {
        text: 'BILLY MAYS AQUI PARA ___ .',
        pick: 1,
        packId: 'base-pack',
        id: 'eih4k71pmnaf0c6bzczdexxi'
      },
      {
        text: 'O novo reality show Bravo apresenta oito celebridades decadentes convivendo com ___ .',
        pick: 1,
        packId: 'base-pack',
        id: 'a1md9e0qlnv629awt8da90zy'
      },
      {
        text: 'Apresentado por Bud Light®, a Cerveja Oficial de ___ .',
        pick: 1,
        packId: 'base-pack',
        id: 'qd56z9fsuvm7o9ouwjcmy508'
      },
      {
        text: 'Apresentado por Original, a Cerveja Oficial de ___ .',
        pick: 1,
        packId: 'base-pack',
        id: 'u8abpuieror6csz9e9btopnf'
      },
      {
        text: 'Apresentado por Skol, a Cerveja Oficial de ___ .',
        pick: 1,
        packId: 'base-pack',
        id: 'rbibdiw2mrjsmneyxoz7bj9t'
      },
      {
        text: 'Mas antes de matá-lo, Sr. Bond, devo mostrar-lhe ___ .',
        pick: 1,
        packId: 'base-pack',
        id: 'n0xwusejknjudhr7valx50vv'
      },
      {
        text: 'TV Record apresenta ": A História de ___ ."',
        pick: 2,
        packId: 'base-pack',
        id: 'jl38sxgfhlsqjwnextuxd2b9'
      },
      {
        text: 'Globo apresenta ___ , a história de ___ .',
        pick: 2,
        packId: 'base-pack',
        id: 'kb2xo0r8qh86xqayhra8snj1'
      },
      {
        text: 'O novo reality show do SBT apresenta oito celebridades decadentes convivendo com ___ .',
        pick: 1,
        packId: 'base-pack',
        id: 'f6gsbszwr2pkkggvjk3nuniy'
      },
      {
        text: 'O SBT tem o prazer de apresentar no seu novo show de variedades, "Oie oie é a tropa do ___ ".',
        pick: 1,
        packId: 'base-pack',
        id: 'zvb9w7zkiokllwu0helxzqtq'
      },
      {
        text: 'Charlie e a fábrica de ___',
        pick: 1,
        packId: 'base-pack',
        id: 'xd7ucgoyqzamtj88gr3ppfci'
      },
      {
        text: 'Se liga, mano! Eu chamo esse movimento de dança de " ___ ".',
        pick: 1,
        packId: 'base-pack',
        id: 'w963qt4aow2jjiwmbxfsb61b'
      },
      {
        text: 'Clique aqui para ___ !!!',
        pick: 1,
        packId: 'base-pack',
        id: 'sgpoeetuaprzzllz89vq0tlj'
      },
      {
        text: 'Nesta temporada, a clássica peça existencialista de Samuel Beckett: À espera de ___ .',
        pick: 1,
        packId: 'base-pack',
        id: 'an6kev8a3s74ylm8ugqoa18f'
      },
      {
        text: 'Chegando à Broadway nesta temporada, ___ : O Musical.',
        pick: 1,
        packId: 'base-pack',
        id: 'bolgcy9ffycl4q8mscyn0nni'
      },
      {
        text: 'Chegando aos cinemas nesta temporada de férias, "Star Wars: A Ascensão de ___ ".',
        pick: 1,
        packId: 'base-pack',
        id: 'g5tb96kos4ckywx9uk48axj2'
      },
      {
        text: 'Caramba! Eu nunca vi ___ assim antes! Vamos chegar um pouco mais perto.',
        pick: 1,
        packId: 'base-pack',
        id: 'fi94ykcn8al1csrledz9f15t'
      },
      {
        text: 'SBT apresenta " ___ : A História de ___ ".',
        pick: 2,
        packId: 'base-pack',
        id: 'guaetfbila4aed991lcmco71'
      },
      {
        text: 'Papai, por que mamãe está chorando?',
        pick: 1,
        packId: 'base-pack',
        id: 'lktxy44v2yqweb6msb45l7lt'
      },
      {
        text: 'Papai, por que mamãe está chorando?',
        pick: 1,
        packId: 'base-pack',
        id: 'gps4nn7uox5fupmbbnvbdbpi'
      },
      {
        text: 'Querida Abby, estou tendo alguns problemas com ___ e gostaria do seu conselho.',
        pick: 1,
        packId: 'base-pack',
        id: 'makxghocovml9ooe5vtft3jn'
      },
      {
        text: 'Querida Conselheira do Sofrimento, estou tendo alguns problemas com ___ e preciso do seu conselho.',
        pick: 1,
        packId: 'base-pack',
        id: 'd1dv69qd515y7x2tae1efltw'
      },
      {
        text: 'Prezado Senhor ou Senhora, lamentamos informar que o Escritório de ___ negou o seu pedido para ___ .',
        pick: 2,
        packId: 'base-pack',
        id: 'q3kw3x5frf7bk16bwvoite3r'
      },
      {
        text: 'Médico, você foi longe demais! O corpo humano não foi feito para suportar essa quantidade de ___ !',
        pick: 1,
        packId: 'base-pack',
        id: 'qztqlg8l62qwctz6tvc0yw83'
      },
      {
        text: 'Cara, não vá nesse banheiro. Tem ___ lá dentro.',
        pick: 1,
        packId: 'base-pack',
        id: 'hmya28bw6it1cvy365hx3pwc'
      },
      {
        text: 'Cara, não vá nesse banheiro. Tem ___ lá dentro.',
        pick: 1,
        packId: 'base-pack',
        id: 'q5gzn17q2rigjqaa25pusn92'
      },
      {
        text: 'Devido a um fiasco de relações públicas, o Pão de Açúcar não oferece mais ___ .',
        pick: 1,
        packId: 'base-pack',
        id: 'izjyyx7omr89h7k1646m8gao'
      },
      {
        text: 'Durante sua infância, Salvador Dalí produziu centenas de pinturas de ___ .',
        pick: 1,
        packId: 'base-pack',
        id: 'fu2dsyjno63pjxa4a1htnlpn'
      },
      {
        text: 'Durante sua curta carreira no boxe, o Messias lutou sob o nome de Jesus " ___ " Cristo.',
        pick: 1,
        packId: 'base-pack',
        id: 'rgxzxtb6ry9ctfntr1d952af'
      },
      {
        text: 'Durante o frequentemente esquecido Período Marrom de Picasso, ele produziu centenas de pinturas de ___ .',
        pick: 1,
        packId: 'base-pack',
        id: 'qedykdcga1mjrs80228c5z12'
      },
      {
        text: 'Durante o sexo, gosto de pensar em ___ .',
        pick: 1,
        packId: 'base-pack',
        id: 'z71d6d9emw6xdouxd4e4o2xi'
      },
      {
        text: 'Finalmente! Um serviço que entrega ___ diretamente à sua porta.',
        pick: 1,
        packId: 'base-pack',
        id: 'caf2l5lef8k8w2vi9iqhsqaw'
      },
      {
        text: 'Em meu turno, gastarei quatro moedas de ouro e alocarei os três trabalhadores para ___ .',
        pick: 1,
        packId: 'base-pack',
        id: 'bhtevlek6hs8ww68n8wg32cf'
      },
      {
        text: 'Dica divertida! Quando seu homem pedir para você fazer sexo oral nele, tente surpreendê-lo com ___ .',
        pick: 1,
        packId: 'base-pack',
        id: 'fqrjwukqry2eiwhkw325mj6z'
      },
      {
        text: 'Historiadores futuros concordarão que ___ marcou o início do declínio da América.',
        pick: 1,
        packId: 'base-pack',
        id: 'na3647xfkm6l74mu1wu9wg1y'
      },
      {
        text: 'Tendo problemas com ___ ? Experimente ___ !',
        pick: 2,
        packId: 'base-pack',
        id: 'rg3sdy671jwmyte6yqlxhbtz'
      },
      {
        text: 'Ei pessoal, bem-vindos ao Mequi! Gostariam de começar a noite com ___ ?',
        pick: 1,
        packId: 'base-pack',
        id: 'qa0b8kzzff3zz36y7rsd05j5'
      },
      {
        text: 'Ei pessoal, bem-vindos ao BK Gostariam de começar a noite com ___ ?',
        pick: 1,
        packId: 'base-pack',
        id: 'lc9wmew06g338agvt52vlgrz'
      },
      {
        text: 'Ei pessoal, bem-vindos ao Pizza Hut! Gostariam de começar a noite com ___ ?',
        pick: 1,
        packId: 'base-pack',
        id: 'tnk0phod4qm01qljws0et2vo'
      },
      {
        text: 'Ei pessoal, bem-vindos ao Spolleto! Gostariam de começar a noite com ___ ?',
        pick: 1,
        packId: 'base-pack',
        id: 'psd9nzvwye9yubvubvvm56e2'
      },
      {
        text: 'Ei XetGPT! Sou ___ . Me pergunte qualquer coisa.',
        pick: 1,
        packId: 'base-pack',
        id: 'jgzuo4l2jnjx9ik6cx6066rv'
      },
      {
        text: 'Como estou mantendo meu status de relacionamento?',
        pick: 1,
        packId: 'base-pack',
        id: 'uabvuudb1mun7g7wqibp6fum'
      },
      {
        text: 'Como perdi minha virgindade?',
        pick: 1,
        packId: 'base-pack',
        id: 's656cmbvlzl0rfq2vlz5uahm'
      },
      {
        text: 'Não sei com que armas a Terceira Guerra Mundial será lutada, mas a Quarta Guerra Mundial será lutada com ___ .',
        pick: 1,
        packId: 'base-pack',
        id: 'l8lottl5emga2c2pnds2h2bm'
      },
      {
        text: 'Bebo para esquecer ___ .',
        pick: 1,
        packId: 'base-pack',
        id: 'xpfmqagj2hqbl1cf20royq0l'
      },
      {
        text: 'Dou um jeito com a ajuda de ___ .',
        pick: 1,
        packId: 'base-pack',
        id: 'bncn7dfiv2tcjt3r5glajjj0'
      },
      {
        text: 'Tenho 99 problemas, mas ___ não é um deles.',
        pick: 1,
        packId: 'base-pack',
        id: 'ixn3uzdwy7jjx9ts6pjedci3'
      },
      {
        text: 'Sei que quando o telefone toca, só pode significar uma coisa: ___ .',
        pick: 1,
        packId: 'base-pack',
        id: 'lj1nbyw38kgzt7cqtu8v533m'
      },
      {
        text: 'Aprendi da maneira mais difícil que você não pode animar um amigo que está de luto com ___ .',
        pick: 1,
        packId: 'base-pack',
        id: 's7x4t1hra6diub78e1uewwiy'
      },
      {
        text: 'Nunca entendi verdadeiramente ___ até me deparar com ___ .',
        pick: 2,
        packId: 'base-pack',
        id: 'axo5nshasv2i420ql0z6yr6k'
      },
      {
        text: 'Espio com meu olhinho ___ .',
        pick: 1,
        packId: 'base-pack',
        id: 'hs03i46sa8gb9gm6g4zzvvtp'
      },
      {
        text: 'Quem me dera não ter perdido o manual de instruções de ___ .',
        pick: 1,
        packId: 'base-pack',
        id: 'z5jigl4dmmecfxsk99jj40xn'
      },
      {
        text: 'Vou fazer uma limpeza nesta semana. Nada além de suco de couve e ___ .',
        pick: 1,
        packId: 'base-pack',
        id: 'cxg0toht0psk1g0v6vanf97m'
      },
      {
        text: 'Sou Lebron James, e quando não estou enterrando bolas, eu amo ___ .',
        pick: 1,
        packId: 'base-pack',
        id: 'q932lbeoxbjsv9us2jbbenkl'
      },
      {
        text: 'Não sou médico, mas tenho certeza de que o que você está sofrendo se chama " ___ ".',
        pick: 1,
        packId: 'base-pack',
        id: 'se2081fbbz8j4s8k7150ut02'
      },
      {
        text: 'Desculpe, professor, mas não consegui completar minha lição de casa por causa de ___ .',
        pick: 1,
        packId: 'base-pack',
        id: 'yrajvl1k3uc1s31jxghtfzms'
      },
      {
        text: 'Desculpe, senhor, mas não consegui completar minha lição de casa por causa de ___ .',
        pick: 1,
        packId: 'base-pack',
        id: 'xt0y101b34os8ofdy92sex07'
      },
      {
        text: 'Não sou como o resto de vocês. Sou muito rico e ocupado para ___ .',
        pick: 1,
        packId: 'base-pack',
        id: 'mbtqvjt89oup0v2ea75tlib9'
      },
      {
        text: 'Se não puder estar com aquele que você ama, ame ___',
        pick: 1,
        packId: 'base-pack',
        id: 'jlhwizt6ast4sqazquszldmb'
      },
      {
        text: 'Se você gosta de ___ , VOCÊ PODE SER UM CAIPIRA.',
        pick: 1,
        packId: 'base-pack',
        id: 'r7ft0tks4lyugkth6n1n0w10'
      },
      {
        text: 'Daqui a 1.000 anos, quando o dinheiro em papel for uma lembrança distante, como pagaremos por bens e serviços?',
        pick: 1,
        packId: 'base-pack',
        id: 'eq5q7wnkq70a1ibapzbxz7e0'
      },
      {
        text: 'Daqui a 1.000 anos, quando o dinheiro em papel for apenas uma lembrança distante, ___ será a nossa moeda.',
        pick: 1,
        packId: 'base-pack',
        id: 'alg49qclolm8jgo1c2y8cbqh'
      },
      {
        text: 'Em um mundo devastado por ___ , nosso único consolo é ___ .',
        pick: 2,
        packId: 'base-pack',
        id: 'r4cokjc2wtdglc277j58jxdj'
      },
      {
        text: 'Em um mundo devastado por ___ , nosso único consolo é ___ .',
        pick: 2,
        packId: 'base-pack',
        id: 'md6xbxjbcrkzab50bs5m1s9c'
      },
      {
        text: 'Na tentativa de alcançar um público maior, o Museu Nacional da Austrália abriu uma exposição interativa sobre ___ .',
        pick: 1,
        packId: 'base-pack',
        id: 'wsiu2gduakydy1idgfz9jg40'
      },
      {
        text: 'Na tentativa de alcançar um público maior, o Museu Nacional de História Natural do Smithsonian abriu uma exposição interativa sobre ___ .',
        pick: 1,
        packId: 'base-pack',
        id: 'ykmut7r2xml5q2nh9p98290x'
      },
      {
        text: 'Na Austrália, ___ é duas vezes maior e duas vezes mais mortal.',
        pick: 1,
        packId: 'base-pack',
        id: 'p704qivbknq5w8gmz9kt27yv'
      },
      {
        text: 'Em Belmarsh Prison, dizem que você pode trocar 200 cigarros por ___ .',
        pick: 1,
        packId: 'base-pack',
        id: 'pv2eeyibvi40cpujvsi41ftj'
      },
      {
        text: 'Em seu último longa-metragem, Tracy Beaker luta com ___ pela primeira vez.',
        pick: 1,
        packId: 'base-pack',
        id: 'o1c9ayeee90woe39op881dda'
      },
      {
        text: 'Em seu novo álbum auto-produzido, Kanye West canta por cima dos sons de ___ .',
        pick: 1,
        packId: 'base-pack',
        id: 'zzjo02x3o9m2e9cm5we00qv8'
      },
      {
        text: 'Em sua nova comédia de verão, Leo Lins é ___ preso no corpo de ___.',
        pick: 2,
        packId: 'base-pack',
        id: 'g6nvzsr82jzw98tn06hj266a'
      }
    ]
  }
};
