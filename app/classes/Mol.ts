// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as $ from 'jquery';
import * as $3Dmol from '3dmol';
import randomColor from 'randomcolor';

interface FocusData {
  C: string;
  CGLMi: number;
  Ri: number;
  Rn: string;
  Rpl: string;
}

class Mol {
  private GLV: $3Dmol.GLViewer;

  /**
   * @member
   * @type {Array}
   * @description chain array.
   */
  private CA: string[];

  /**
   * @member
   * @type {Array}
   * @description resdient array.
   */
  private RA: FocusData[];

  /**
   * @member
   * @type {Object}
   * @description chain GLModel id indexed by chain.
   */
  private CGLMiibC: { [chain: string]: number } = {};

  /**
   * @member
   * @type {Object}
   * @description chain GLModel PDB text data indexed by chain.
   */
  private CGLMPDBibC = {};

  /**
   * @member
   * @type {Object}
   * @description  Residue GLModel PDB and chain GLModel id and chain and residue name index by residue id.
   */
  private RdAibRiibC: { [chain: string]: { [residueId: number]: FocusData } } =
    {};

  /**
   * @member
   * @type {Object}
   * @description  last focus.
   */
  private lF: FocusData;

  /**
   * @member
   * @type {$3Dmol.GLModel}
   * @description last focus residue GLModel.
   */
  private lfRGLM: $3Dmol.GLModel;

  /**
   * @member
   * @type {$3Dmol.Label}
   */
  private lfL: $3Dmol.Label;

  /**
   * @member
   * @type {Object}
   * @description current focus
   */
  private cF: FocusData;

  /**
   * @member
   * @type {String}
   */
  public id: string;

  /**
   * @member
   * @type {Boolean}
   * @description is hided or shown.
   */
  private ish: boolean;

  constructor(pdb: string, element: HTMLElement, id?: string) {
    this.id = id || new Date().toISOString();
    this.bind(element);
    this.render(pdb);
    const dataToFocus: FocusData[] = [];
    const { CA, RdAibRiibC } = this;
    CA.forEach((A) => {
      const RdAibRi = RdAibRiibC[A];
      const RiA = Reflect.ownKeys(RdAibRi).map(Number);
      for (let RiAi = 0; RiAi < RiA.length; RiAi += 1) {
        const R: FocusData = RdAibRi[RiA[RiAi]];
        dataToFocus.push(R);
      }
    });
    this.RA = dataToFocus;
  }

  getPngUrl() {
    return this.GLV.pngURI();
  }

  /**
   * @function
   * @description registe GLViewer and bind to canvas container.
   * @param {Element} element
   * @param {Element} tempElement
   */
  private bind(element: HTMLElement) {
    this.GLV = $3Dmol.createViewer(element, {
      id: `${this.id}`,
      backgroundAlpha: 0,
    });
  }

  /**
   * @static
   * @since 0.1.0
   * @function
   * @param {string} Rn residue name.
   * @description get abbreviation from residue name.
   * @returns abbreviation residue name.
   */
  private static gafRn(Rn: string) {
    switch (Rn) {
      case 'ALA':
        return 'A';
      case 'ARG':
        return 'R';
      case 'ASN':
        return 'N';
      case 'ASP':
        return 'D';
      case 'CYS':
        return 'C';
      case 'GLN':
        return 'Q';
      case 'GLU':
        return 'E';
      case 'GLY':
        return 'G';
      case 'HIS':
        return 'H';
      case 'ILE':
        return 'I';
      case 'LEU':
        return 'L';
      case 'LYS':
        return 'K';
      case 'MET':
        return 'M';
      case 'PHE':
        return 'F';
      case 'PRO':
        return 'P';
      case 'SER':
        return 'S';
      case 'THR':
        return 'T';
      case 'TRP':
        return 'W';
      case 'TYR':
        return 'Y';
      case 'VAL':
        return 'V';
      case 'Ala':
        return 'A';
      case 'SEC':
        return 'U';
      case 'PYL':
        return 'O';
      case 'HOH':
        return '水';
      case 'NAG':
        return '葡';
      case 'PO4':
        return '磷';
      default:
        return Rn;
    }
  }

  /**
   * @static
   * @since 0.1.0
   * @function
   * @description get atom array from PDB text data.
   * @param {string} PDB PDB text data.
   * @returns {Array} common GLModel atom array.
   */
  private static gAAfPDB(PDB: string) {
    const cGLMAA = $3Dmol.Parsers.PDB(PDB, {})[0];
    return cGLMAA;
  }

  /**
   * @static
   * @since 0.1.0
   * @function
   * @description get chain array from common GLModel atom array.
   * @param {Array} cGLMAA common GLModel atom array.
   * @returns {Array} chain array.
   */
  private static gCAfcGLMAA(cGLMAA: $3Dmol.AtomSpec[]) {
    /**
     * @type {Array}
     * @description dist atom array to return.
     */
    let CA = [cGLMAA[0].chain];
    for (let cGLMAAi = 1; cGLMAAi < cGLMAA.length; cGLMAAi += 1) {
      /**
       * @type {string}
       * @description last chain in current chain array.
       */
      const lCicCA = CA[CA.length - 1];
      if (cGLMAA[cGLMAAi].chain !== lCicCA) {
        CA.push(cGLMAA[cGLMAAi].chain);
      }
    }
    /**
     * @function
     * @description array dedeuplicate.
     * @param {array} array
     * @returns deduplicated array.
     */
    const dd = (array: string[]) => Array.from(new Set(array));
    CA = dd(CA);
    return CA;
  }

  /**
   * @static
   * @since 0.1.0
   * @function
   * @description get residue array from common GLModel atom array.
   * @param {Array} cGLMAA common GLModel atom array.
   * @param {Object} CGLMiibC chain GLModel id indexed by chain.
   * @returns {Array} residue array.
   */
  private static gRibRiibC(
    cGLMAA: $3Dmol.AtomSpec[],
    CGLMiibC: { [chain: string]: number },
  ) {
    /**
     * dist residue array to return.
     */
    const RAibC: { [chain: string]: { [residueId: number]: FocusData } } = {};
    //
    const fcGLMA = cGLMAA[0];
    //
    const fR = {
      C: fcGLMA.chain,
      CGLMi: CGLMiibC[fcGLMA.chain],
      Ri: fcGLMA.resi,
      Rn: Mol.gafRn(fcGLMA.resn),
      Rpl: fcGLMA.pdbline,
    };
    RAibC[fcGLMA.chain] = {};
    RAibC[fcGLMA.chain][fR.Ri] = fR;
    //
    for (let cGLMAAi = 1; cGLMAAi < cGLMAA.length; cGLMAAi += 1) {
      const cGLMA = cGLMAA[cGLMAAi];
      const { chain, pdbline, resi, resn } = cGLMA;
      //
      if (RAibC[chain]) {
        if (RAibC[chain][resi]) {
          const R = RAibC[chain][resi];
          const lR = R;
          lR.Rpl += '\n';
          lR.Rpl += pdbline;
        } else {
          RAibC[chain][resi] = {
            C: chain,
            CGLMi: CGLMiibC[chain],
            Ri: resi,
            Rn: Mol.gafRn(resn),
            Rpl: pdbline,
          };
        }
      } else {
        RAibC[chain] = {};
        RAibC[chain][resi] = {
          C: chain,
          CGLMi: CGLMiibC[chain],
          Ri: resi,
          Rn: Mol.gafRn(resn),
          Rpl: pdbline,
        };
      }
    }
    return RAibC;
  }

  /**
   * @static
   * @since 0.1.0
   * @function
   * @description get chain GLModel PDB text data indexed by chain from chain array.
   * @param {Array} cGLMAA common GLModel atoms array .
   */
  private static gCGLMPDBibCfCA(cGLMAA: $3Dmol.AtomSpec[]) {
    const PDBibC: { [chain: string]: string } = {};
    for (let cGLMAAi = 0; cGLMAAi < cGLMAA.length; cGLMAAi += 1) {
      const tcGLMA = cGLMAA[cGLMAAi];
      const { chain: tC, pdbline: tpl } = tcGLMA;
      if (PDBibC[tC]) {
        PDBibC[tC] += '\n';
        PDBibC[tC] += tpl;
      } else {
        PDBibC[tC] = tpl;
      }
    }
    return PDBibC;
  }

  /**
   * @function
   * @since 0.1.0
   * @description add chain GLModel to GLViewer.
   * @param {Array} CA chain array.
   * @param Array} cGLMAA chain GLModel atoms array.
   */
  private uCGLM(CA: string[], cGLMAA: $3Dmol.AtomSpec[]) {
    const CGLMPDBibC = Mol.gCGLMPDBibCfCA(cGLMAA);
    for (let CAi = 0, CAl = CA.length; CAi < CAl; CAi += 1) {
      const C = CA[CAi];
      const CGLM = this.GLV.addModel(CGLMPDBibC[C], 'pdb');
      this.CGLMiibC[C] = CGLM.getID();
      CGLM.setStyle(
        {},
        {
          cartoon: {
            color: randomColor({ luminosity: 'light' }),
          },
        },
      );
    }
  }

  /**
   * @function
   * @since 0.1.0
   * @description build residue data.
   * @param {Object} RibRiibC residue indexed by residue id indexed by chain.
   * @param {Array} CA chain array.
   */
  private uRGLM_bRdAibRiibC(
    RibRiibC: { [chain: string]: { [residueId: number]: FocusData } },
    CA: string[],
  ) {
    for (let CAi = 0, CAl = CA.length; CAi < CAl; CAi += 1) {
      const C = CA[CAi];
      const RibRi = RibRiibC[C];
      const RiA = Reflect.ownKeys(RibRi).map(Number);
      for (let RiAi = 0, RiAl = RiA.length; RiAi < RiAl; RiAi += 1) {
        const Ri = RiA[RiAi];
        const R: FocusData = RibRi[Ri];
        if (this.RdAibRiibC[C]) {
          this.RdAibRiibC[C][Ri] = R;
        } else {
          this.RdAibRiibC[C] = {};
          this.RdAibRiibC[C][Ri] = R;
        }
      }
    }
  }

  /**
   * @function
   * @since 0.1.0
   * @description set click feedback.
   */
  private sc() {
    this.CA.forEach((C) => {
      const CGLMi = this.CGLMiibC[C];
      const CGLM = this.GLV.getModel(CGLMi);
      CGLM.setClickable({}, true, (atom: $3Dmol.AtomSpec) => {
        const { chain, resi } = atom;
        const Rd = this.RdAibRiibC[chain][resi];
        this.focus(Rd);
        this.cF = Rd;
      });
    });
  }

  /**
   * @function
   * @description render chain GLModel and build residue data array.
   * @param {string} cPDB common PDB text data.
   */
  private render(cPDB: string) {
    const cGLMAA = Mol.gAAfPDB(cPDB);
    this.CA = Mol.gCAfcGLMAA(cGLMAA);
    this.uCGLM(this.CA, cGLMAA);
    const RibRiibC = Mol.gRibRiibC(cGLMAA, this.CGLMiibC);
    this.uRGLM_bRdAibRiibC(RibRiibC, this.CA);
    this.sc();
    //
    this.GLV.render();
    //
    this.GLV.zoomTo();
    this.GLV.zoom(0.618);
    //
  }

  public h() {
    this.ish = true;
    //
    this.CA.forEach((C) => {
      const CGLMi = this.CGLMiibC[C];
      const CGLM = this.GLV.getModel(CGLMi);
      CGLM.hide();
      if (this.lfRGLM) {
        this.lfRGLM.hide();
      }
    });
    //
    if (this.lfL) {
      this.GLV.setLabelStyle(this.lfL, {
        showBackground: false,
        fontOpacity: 0,
      });
    }
    //
    this.GLV.render();
  }

  public sfh() {
    this.ish = false;
    //
    this.CA.forEach((C) => {
      const CGLMi = this.CGLMiibC[C];
      const CGLM = this.GLV.getModel(CGLMi);
      CGLM.show();
      if (this.lfRGLM) {
        this.lfRGLM.show();
      }
    });
    if (this.lfL) {
      this.GLV.setLabelStyle(this.lfL, {
        showBackground: true,
        fontOpacity: 1,
      });
    }
    this.GLV.render();
  }

  /**
   * @function
   * @param {Object} focusData resiude data to focus.
   */
  public focus(focusData: FocusData) {
    const { Rpl, Rn } = focusData;
    let focusRGLM;
    /**
     * @function
     * @description show focused residue
     */
    (() => {
      if (this.lF) {
        this.GLV.removeModel(this.lfRGLM);
      }
      this.lF = focusData;
      /**
       * @type {$3Dmol.GLM}
       */
      focusRGLM = this.GLV.addModel(Rpl, 'pdb');
      this.lfRGLM = focusRGLM;
      focusRGLM.setStyle({}, { sphere: { opacity: 0.816 }, stick: {} });
    })();
    /**
     * @function
     * @description show focused residue lable
     */
    (() => {
      this.GLV.removeAllLabels();
      this.lfL = this.GLV.addLabel(
        Rn,
        { fontSize: 13.4 },
        { model: focusRGLM.getID() },
      );
    })();
    /**
     * @function
     */
    (() => {
      this.GLV.render();
    })();
    //
    const { C, Ri } = focusData;
    this.GLV.zoomTo({ resi: Ri, chain: C }, 168);
  }

  public reset() {
    this.GLV.zoomTo();
  }
}

export default Mol;
export { FocusData };
