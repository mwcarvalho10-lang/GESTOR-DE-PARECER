import { Skill } from './types';
import { subjectPalettes } from './constants';
import { grade2Skills } from './skills/grade2';
import { grade3Skills } from './skills/grade3';
import { grade4Skills } from './skills/grade4';
import { grade5Skills } from './skills/grade5';

export const defaultSkills: Skill[] = [
  // PORTUGUÊS (LINGUAGENS)
  { id: 'EF01LP01', grade: '1', subject: 'portugues', report: 'APRECIA TEXTOS LITERÁRIOS', color: subjectPalettes['portugues'][0] },
  { id: 'EF01LP02', grade: '1', subject: 'portugues', report: 'LÊ E COMPREENDE TEXTOS DE DIFERENTES GÊNEROS (CONTOS, POEMAS, PARLENDAS, CANÇÕES, MITOS, TEXTOS INSTRUCIONAIS, TEXTOS EXPOSITIVOS DE DIVULGAÇÃO CIENTÍFICA, NOTÍCIAS).', color: subjectPalettes['portugues'][0] },
  { id: 'EF01LP03', grade: '1', subject: 'portugues', report: 'RECONHECE QUE HÁ DIFERENTES PROPÓSITOS DE LEITURA', color: subjectPalettes['portugues'][0] },
  { id: 'EF01LP04', grade: '1', subject: 'portugues', report: 'RECONTA, COLETIVAMENTE, HISTÓRIAS CONHECIDAS LIDAS PELO PROFESSOR.', color: subjectPalettes['portugues'][0] },
  { id: 'EF01LP05', grade: '1', subject: 'portugues', report: 'RECONTA, INDIVIDUALMENTE, HISTÓRIAS CONHECIDAS LIDAS PELO PROFESSOR.', color: subjectPalettes['portugues'][0] },
  { id: 'EF01LP06', grade: '1', subject: 'portugues', report: 'REESCREVE, COLETIVAMENTE, DITANDO PARA O PROFESSOR, TRECHOS DE CONTOS CONHECIDOS.', color: subjectPalettes['portugues'][0] },
  { id: 'EF01LP07', grade: '1', subject: 'portugues', report: 'PRODUZ, COLETIVAMENTE, TEXTOS DE AUTORIA, DITANDO AO PROFESSOR.', color: subjectPalettes['portugues'][0] },
  { id: 'EF01LP08', grade: '1', subject: 'portugues', report: 'REVISA, COM O APOIO DO PROFESSOR, O QUE ESTÁ ESCREVENDO (REESCRITA OU TEXTO DE AUTORIA)', color: subjectPalettes['portugues'][0] },
  { id: 'EF01LP09', grade: '1', subject: 'portugues', report: 'REVISA, COLETIVAMENTE, OS TEXTOS DEPOIS DE FINALIZADA A PRIMEIRA VERSÃO.', color: subjectPalettes['portugues'][0] },
  { id: 'EF01LP10', grade: '1', subject: 'portugues', report: 'PARTICIPA DE SITUAÇÕES DE INTERCÂMBIO ORAL DO COTIDIANO ESCOLAR.', color: subjectPalettes['portugues'][0] },
  { id: 'EF01LP11', grade: '1', subject: 'portugues', report: 'LÊ TEXTO COM O APOIO DO PROFESSOR.', color: subjectPalettes['portugues'][0] },
  { id: 'EF01LP12', grade: '1', subject: 'portugues', report: 'LÊ TEXTO COM O COLEGA DE DUPLA.', color: subjectPalettes['portugues'][0] },
  { id: 'EF01LP13', grade: '1', subject: 'portugues', report: 'LÊ TEXTO INDIVIDUALMENTE.', color: subjectPalettes['portugues'][0] },
  { id: 'EF01LP14', grade: '1', subject: 'portugues', report: 'ESCREVE PALAVRAS OU TEXTO COM O APOIO DO PROFESSOR', color: subjectPalettes['portugues'][0] },
  { id: 'EF01LP15', grade: '1', subject: 'portugues', report: 'ESCREVE PALAVRAS OU TEXTO COM O APOIO DO COLEGA DE DUPLA.', color: subjectPalettes['portugues'][0] },
  { id: 'EF01LP16', grade: '1', subject: 'portugues', report: 'ESCREVE PALAVRAS OU TEXTO INDIVIDUALMENTE.', color: subjectPalettes['portugues'][0] },
  { id: 'EF01LP17', grade: '1', subject: 'portugues', report: 'LÊ, POR SI MESMO, TEXTOS DIVERSOS COMO PLACAS DE IDENTIFICAÇÃO, LISTAS, MANCHETES DE JORNAL, LEGENDAS, HISTÓRIAS EM QUADRINHOS, TIRINHAS E RÓTULOS, ENTRE OUTROS, COM A AJUDA DO PROFESSOR QUANDO NECESSÁRIO.', color: subjectPalettes['portugues'][0] },

  // MATEMÁTICA
  { id: 'EF01MA01', grade: '1', subject: 'matematica', report: 'PARTICIPA DE DISCUSSÕES COLETIVAS, ESFORÇANDO-SE PARA INTERPRETAR AS IDEIAS DOS COLEGAS E COMUNICAR AS PRÓPRIAS ESTRATÉGIAS DE RESOLUÇÃO COM O OBJETIVO DE ORGANIZAR ARGUMENTOS E ELABORAR JUSTIFICATIVAS.', color: subjectPalettes['matematica'][0] },
  { id: 'EF01MA02', grade: '1', subject: 'matematica', report: 'IDENTIFICA A ORGANIZAÇÃO POSICIONAL DO NOSSO SISTEMA DE NUMERAÇÃO ELABORANDO HIPÓTESES PARA PRODUZIR, COMPARAR E ORDENAR ESCRITAS NUMÉRICAS DE DIFERENTES QUANTIDADES DE ALGARISMOS.', color: subjectPalettes['matematica'][0] },
  { id: 'EF01MA03', grade: '1', subject: 'matematica', report: 'REALIZA A CONTAGEM CONSTRUINDO PROCEDIMENTOS PARA COMPARAR A QUANTIDADE DE OBJETOS DE DUAS COLEÇÕES (GRUPOS DE OBJETOS), IDENTIFICANDO A QUE TEM MAIS, A QUE TEM MENOS, OU CONSTATANDO QUE ELAS TÊM A MESMA QUANTIDADE.', color: subjectPalettes['matematica'][0] },
  { id: 'EF01MA04', grade: '1', subject: 'matematica', report: 'CONTA EM ESCALAS ASCENDENTE E DESCENDENTE DE 1 EM 1, DE 2 EM 2, DE 5 EM 5, DE 10 EM 10 ETC.', color: subjectPalettes['matematica'][0] },
  { id: 'EF01MA05', grade: '1', subject: 'matematica', report: 'RESOLVE PROBLEMAS DE ADIÇÃO E SUBTRAÇÃO ENVOLVENDO PEQUENAS QUANTIDADES, ABARCANDO AS IDEIAS DE JUNTAR, ACRESCENTAR, GANHAR, AVANÇAR, TIRAR E PERDER E UTILIZANDO ESTRATÉGIAS PESSOAIS COMO DESENHO, MARCAS, NÚMEROS OU CÁLCULOS, SEM O USO DE TÉCNICAS OPERATÓRIAS CONVENCIONAIS.', color: subjectPalettes['matematica'][0] },
  { id: 'EF01MA06', grade: '1', subject: 'matematica', report: 'CONSTRÓI PROGRESSIVAMENTE, NA MEMÓRIA, REPERTÓRIO DE RESULTADOS DA ADIÇÃO E SUBTRAÇÃO COMO O DOBRO, A ADIÇÃO DE + 1 E A SUBTRAÇÃO -1 E ADIÇÕES QUE RESULTAM EM 10.', color: subjectPalettes['matematica'][0] },
  { id: 'EF01MA07', grade: '1', subject: 'matematica', report: 'EXPLORA SITUAÇÕES RELATIVAS À MULTIPLICAÇÃO E À DIVISÃO UTILIZANDO ESTRATÉGIAS PESSOAIS, COMO DESENHOS, CONTAGEM E PROCEDIMENTOS NUMÉRICOS.', color: subjectPalettes['matematica'][0] },
  { id: 'EF01MA08', grade: '1', subject: 'matematica', report: 'IDENTIFICA E DESCREVER A LOCALIZAÇÃO E O DESLOCAMENTO DE PESSOAS E OBJETOS EM ESPAÇOS FAMILIARES CONSIDERANDO PONTOS DE REFERÊNCIA.', color: subjectPalettes['matematica'][0] },
  { id: 'EF01MA09', grade: '1', subject: 'matematica', report: 'EXPLORA FIGURAS GEOMÉTRICAS PLANAS IDENTIFICANDO O NÚMERO DE LADOS E ÂNGULOS E LADOS RETOS E CURVOS EM SITUAÇÕES DE OBSERVAÇÃO E DESCREVE FIGURAS GEOMÉTRICAS E AS RELAÇÕES EXISTENTES ENTRE ELAS, MESMO QUE SEM UTILIZAR VOCABULÁRIO ESPECÍFICO.', color: subjectPalettes['matematica'][0] },
  { id: 'EF01MA10', grade: '1', subject: 'matematica', report: 'COMPARA E ORDENA OBJETOS EM RELAÇÃO A COMPRIMENTO E CAPACIDADE REALIZANDO ESTIMATIVAS E MEDIÇÕES E UTILIZANDO UNIDADES CONVENCIONAIS E NÃO CONVENCIONAIS E INSTRUMENTOS DE USO SOCIAL.', color: subjectPalettes['matematica'][0] },
  { id: 'EF01MA11', grade: '1', subject: 'matematica', report: 'CONHECE E IDENTIFICA CÉDULAS E MOEDAS DO SISTEMA MONETÁRIO BRASILEIRO E COMPARA OS VALORES.', color: subjectPalettes['matematica'][0] },
  { id: 'EF01MA12', grade: '1', subject: 'matematica', report: 'USA O CALENDÁRIO PARA MARCAR DATAS SIGNIFICATIVAS EXPLORANDO A DISTRIBUIÇÃO DE DIAS NA SEMANA E DE MESES NO ANO.', color: subjectPalettes['matematica'][0] },
  { id: 'EF01MA13', grade: '1', subject: 'matematica', report: 'COLETA DADOS EM UMA PESQUISA ENVOLVENDO APENAS UMA VARIÁVEL, DESCREVE OS RESULTADOS E CONSTRÓI REPRESENTAÇÕES PRÓPRIAS PARA COMUNICÁ-LOS.', color: subjectPalettes['matematica'][0] },
  { id: 'EF01MA14', grade: '1', subject: 'matematica', report: 'INTERPRETA INFORMAÇÕES ORGANIZADAS EM TABELAS SIMPLES (UMA VARIÁVEL) E GRÁFICO DE BARRAS.', color: subjectPalettes['matematica'][0] },

  // CIÊNCIAS
  { id: 'EF01CI01', grade: '1', subject: 'ciencias', report: 'COMPREENDE A IMPORTÂNCIA DOS ÓRGÃOS DO SENTIDO PARA A PERCEPÇÃO E INTERAÇÃO COM O MEIO EM QUE VIVE, PELA OBSERVAÇÃO E DESCRIÇÃO DAS SENSAÇÕES DE GOSTO, CHEIRO, SOM, TEXTURA, COR E FORMA.', color: subjectPalettes['ciencias'][0] },
  { id: 'EF01CI02', grade: '1', subject: 'ciencias', report: 'IDENTIFICA PRÁTICAS DE HIGIENE PESSOAL (LAVAR MÃOS, TOMAR BANHO, LAVAR ALIMENTOS ETC.), BEM COMO PRÁTICAS DE HIGIENE NO NÍVEL COMUNITÁRIO (COLETA DE LIXO, ESGOTAMENTO SANITÁRIO, ACESSO À ÁGUA TRATADA ETC.).', color: subjectPalettes['ciencias'][0] },
  { id: 'EF01CI03', grade: '1', subject: 'ciencias', report: 'QUESTIONA A COMPOSIÇÃO DOS OBJETOS, DE FORMA A PESQUISAR SOBRE E RECONHECE OS MATERIAIS MAIS COMUMENTE EMPREGADOS NA PRODUÇÃO: METAIS, MADEIRA, PLÁSTICOS, VIDRO E PAPEL, DESTACANDO COMO ESSES MATERIAIS SÃO PRODUZIDOS E UTILIZADOS.', color: subjectPalettes['ciencias'][0] },
  
  // HISTÓRIA E GEOGRAFIA
  { id: 'EF01GE01', grade: '1', subject: 'historia', report: 'DESENVOLVE A CAPACIDADE DE OBSERVAÇÃO DA PAISAGEM PRÓXIMA (CASA, ESCOLA, BAIRRO), IDENTIFICANDO OS OBJETOS DA PAISAGEM E ALGUNS USOS E FUNÇÕES.', color: subjectPalettes['historia'][0] },
  { id: 'EF01GE02', grade: '1', subject: 'historia', report: 'EXPRESSA, EM DIFERENTES LINGUAGENS (TEXTO, DESENHOS, FOTOGRAFIAS, MAPAS MENTAIS), A PAISAGEM DOS CONTEXTOS EM QUE ESTÃO INSERIDOS.', color: subjectPalettes['historia'][0] },
  { id: 'EF01GE03', grade: '1', subject: 'historia', report: 'OBSERVA A EXISTÊNCIA, A COMPOSIÇÃO, A DISTRIBUIÇÃO E O ESTADO DE CONSERVAÇÃO DOS OBJETOS ESPACIAIS EXISTENTES NA PAISAGEM DO BAIRRO E DESCREVE ALGUNS USOS IMPORTANTES DESSES OBJETOS.', color: subjectPalettes['historia'][0] },
  { id: 'EF01GE04', grade: '1', subject: 'historia', report: 'IDENTIFICA DIFERENÇAS E AS RELAÇÕES QUE OS SUJEITOS TECEM NA CASA, NA ESCOLA E NO BAIRRO, COMPREENDENDO A IMPORTÂNCIA DE DESENVOLVER ALGUMAS REGRAS DE CONVIVÊNCIA.', color: subjectPalettes['historia'][0] },
  { id: 'EF01GE05', grade: '1', subject: 'historia', report: 'INVESTIGAR A HISTÓRIA DA FAMÍLIA E DE ALGUNS SUJEITOS DO BAIRRO - ORIGEM, PROFISSÕES ETC. - PROCURANDO COMPREENDER SUA INSERÇÃO NO BAIRRO E NA CIDADE.', color: subjectPalettes['historia'][0] },
  { id: 'EF01HI01', grade: '1', subject: 'historia', report: 'RECONHECE A IDENTIDADE E HISTÓRIA PESSOAL.', color: subjectPalettes['historia'][0] },
  { id: 'EF01HI02', grade: '1', subject: 'historia', report: 'COMPREENDE A FAMÍLIA COMO LUGAR A SER CARACTERIZADO NO TEMPO E NO ESPAÇO.', color: subjectPalettes['historia'][0] },
  { id: 'EF01HI03', grade: '1', subject: 'historia', report: 'RECONHECE NO BAIRRO AS DIFERENTES MORADIAS, O AMBIENTE DAS RUAS E AS ÁREAS PÚBLICAS.', color: subjectPalettes['historia'][0] },
  { id: 'EF01HI04', grade: '1', subject: 'historia', report: 'COMPREENDE OS DIAS DA SEMANA, A NOITE E O DIA E AS ATIVIDADES DESENVOLVIDAS PELA CRIANÇA E A FAMÍLIA.', color: subjectPalettes['historia'][0] },
  { id: 'EF01HI05', grade: '1', subject: 'historia', report: 'IDENTIFICA AS OCUPAÇÕES DA CRIANÇA EM CASA E NA ESCOLA.', color: subjectPalettes['historia'][0] },
  { id: 'EF01HI06', grade: '1', subject: 'historia', report: 'IDENTIFICA AS PROFISSÕES DOS COMPONENTES DA FAMÍLIA E SUA RELAÇÃO COM O BAIRRO, A CIDADE E O CONTEXTO ONDE VIVE.', color: subjectPalettes['historia'][0] },
  { id: 'EF01HI07', grade: '1', subject: 'historia', report: 'COMPREENDE A RELAÇÃO DO INDIVÍDUO COM O BAIRRO E SUA CIDADE.', color: subjectPalettes['historia'][0] },
  { id: 'EF01HI08', grade: '1', subject: 'historia', report: 'IDENTIFICA A PASSAGEM DO TEMPO EM ANO, MESES, SEMANAS E DIAS.', color: subjectPalettes['historia'][0] },
  
  ...grade2Skills,
  ...grade3Skills,
  ...grade4Skills,
  ...grade5Skills
];
