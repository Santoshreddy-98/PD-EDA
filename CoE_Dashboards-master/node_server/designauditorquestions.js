const designAuditorAllQuestions = [
    {
        "stageName": 'Synthesis',
        "milestoneName": 'milestone_0.1',
        "checklistType": 'preChecklist',
        "questions": [
            {
                "question": "Synthesis Environment and Scripts To Be Made Ready"
            },
            {
                "question": "CDC Environment and Scripts to be Made Ready"
            },
            {
                "question": "Linting Environment and Scripts to be Made Ready"
            },
            {
                "question": "LEC Environment and Scripts to be Made Ready"
            },
            {
                "question": "Synthesis, LEC, CDC, Constraints File to be prepared and Agreed with Design Team"
            },

        ]
    },
    {
        "stageName": 'Synthesis',
        "milestoneName": 'milestone_0.5',
        "checklistType": 'preChecklist',
        "questions": [
            {
                "question": "Check RTL 0.5 Release in the following Environments Synth, CDC, LEC, Lint"
            },
            {
                "question": "Analyze all Failures and Warnings and Report to RTL Team through Ticket raising mechanism"
            },
            {
                "question": "Ensure all Bugs are Closed and Failures and Warnings are Fixed to give green Light For 0.5 Release"
            },

        ]
    },
    {
        "stageName": 'Synthesis',
        "milestoneName": 'milestone_0.8',
        "checklistType": 'preChecklist',
        "questions": [
            {
                "question": "RTL Version?"
            },
            {
                "question": "Check_design reports have no errors - Synthesis"
            },
            {
                "question": "No unintended latches in the design - Synthesis"
            },
            {
                "question": "No errors in the log - Synthesis"
            },
            {
                "question": "All WARNING reviewed - Synthesis"
            },
            {
                "question": "Review clock/reset paths with physical design team - Synthesis"
            },
            {
                "question": "Number of registers reviewed and inline with expectations - Synthesis"
            },
            {
                "question": "Number of macros reviewed inline with expectations - Synthesis"
            },
            {
                "question": "Confirm LEC Warnings and Errors with Waivers, All Unmapped/Unreachable Points and Codes Reviewed and Waived"
            },
            {
                "question": "Confirm Linting Warnings and Errors with Waivers"
            },
            {
                "question": "Confirm CDC Warnings and Errors with Waivers"
            },
            {
                "question": "Review Constraints. All exceptions blessed from Lead/FE team?"
            },
            {
                "question": "Un Clocked registers/Unintended latches and sequential cells"
            },
            {
                "question": "Un cosntrained sequentials"
            },
            {
                "question": "Combinational loops"
            },
            {
                "question": "Check Design Summary"
            },
            {
                "question": "MV design"
            },
            {
                "question": "Review Constraints. Max trans settings as per the spec for synthesis?"
            },
            {
                "question": "Review constraints - IO delays constrained as per clock-port relationship?"
            },
            {
                "question": "Review Constraints -IO dealy values within limits"
            },
            {
                "question": "Review Constraints - Driving cell and load values are proper and set across corners?"
            },
            {
                "question": "Review Constraints - All the reset ports are hitting syncronisers?"
            },
            {
                "question": "Review Design - Reset for all the flops ciming from synronizers clocked at the same clock?"
            },
            {
                "question": "Review Constraints - Alighned on signoff uncertainity values and extra uncertainity used at earlier stages?"
            },
            {
                "question": "Intel Caliber feedbacks provided to the FE team, corrected RTL/exceptions received and documented?"
            },
        ]
    },
    {
        "stageName": 'Synthesis',
        "milestoneName": 'milestone_1.0',
        "checklistType": 'preChecklist',
        "questions": [
            {
                "question": "Is Final run on CDC/LEC/LINTING/Synthesis with the waiver list done, completed and Checked for Release to PD Team"
            },
        ]
    },

    {
        "stageName": 'Floorplan',
        "milestoneName": 'milestone_0.5',
        "checklistType": 'preChecklist',
        "questions": [
            {
                "question": "Are all scripts and flow in place? (If any modification or discrepancy please mention it in comments)"
            },
            {
                "question": "Are area and shape estimation stratergy followed properly?"
            },
            {
                "question": "Are Partition and IO budgeting stratergy followed properly?"
            },
            {
                "question": "Are all the floorplan guidelines are followed properly?"
            },
            {
                "question": "Are all the macro placement guidelines are followed to place the IPs?"
            },
            {
                "question": "Are all the channel spacing strategies are honored without any issues?"
            },
            {
                "question": "Are all the blockage strategies are followed properly?"
            },
            {
                "question": "Is the optimum floorplan candidate selected?"
            },
            {
                "question": "Is IO planning done accordingly to the ESD and other fab guidelines? (If any discrepancies enter them in the comments)"
            },
            {
                "question": "Are bump planning and RDL routing strategies followed?"
            },
            {
                "question": "Are all top-level timing constraints done?"
            },
            {
                "question": "Is power plan spec completed?"
            },
            {
                "question": "Are power domain creation, power layer usage, pitch guidelines followed to create power structure?"
            },
            {
                "question": "Are there any PG shorts/ opens in the design?"
            },

        ]
    },
    {
        "stageName": 'Floorplan',
        "milestoneName": 'milestone_0.8',
        "checklistType": 'preChecklist',
        "questions": [
            {
                "question": "Are all scripts and flow working properly? (If any modification or discrepancy please mention it in comments)"
            },
            {
                "question": "Are area and shape estimation strategy frozen?"
            },
            {
                "question": "Partition and IO budgeting strategy frozen?"
            },
            {
                "question": "Are all the floorplan guidelines frozen?"
            },
            {
                "question": "Is the optimum floorplan candidate selected?"
            },
            {
                "question": "Is IO ring frozen? (If any discrepancies enter them in the comments)"
            },
            {
                "question": "Are bump planning and RDL routing stratergies frozen?"
            },
            {
                "question": "Are top level timing constraints frozen?"
            },
            {
                "question": "Is power plan spec finalized?"
            },
            {
                "question": "Are power domain creation, power layer usage, pitch guidelines are finalized to create power structure?"
            },
            {
                "question": "Are there any PG shorts/ opens in the design?"
            },

        ]
    },
    {
        "stageName": 'Floorplan',
        "milestoneName": 'milestone_1.0',
        "checklistType": 'preChecklist',
        "questions": [
            {
                "question": "Were latest design and library inputs used ?"
            },
            {
                "question": "Is Netlist uniquified?"
            },
            {
                "question": "Are there any multi driven nets?"
            },
            {
                "question": "Are there any floating inputs?"
            },
            {
                "question": "Have all scripts used recommended tool versions ?"
            },
            {
                "question": "Are there any memories missing?"
            },
            {
                "question": "Is Netlist read correctly?"
            },
            {
                "question": "Is Design properly linked?"
            },
            {
                "question": "Are all the constraints read properly ?"
            },
            {
                "question": "Is Check_timing report validated for unconstrained paths?"
            },
            {
                "question": "Are there any discrepancies like clock not found when clock was expected?"
            },
            {
                "question": "Is incoming timing of the design or zero wire load model timing clean?"
            },
            {
                "question": "Were path groups defined correctly?"
            },
            {
                "question": "Are Setup and hold margins defined in SDC?"
            },
            {
                "question": "Are there any timing exception defined? If yes, why?"
            },
            {
                "question": "What are the Timing corners for implementation ?"
            },
            {
                "question": "Are there any Timing Loops in the design?"
            },
            {
                "question": "Are there any Unmapped Cells in the netlists?"
            },
            {
                "question": "Are all clock-ports have corresponding source pins?"
            },
            {
                "question": "Are all sequential cells clocked?"
            },
            {
                "question": "Are there any No-Clocks/multiple-clocks reported?"
            },
            {
                "question": "Check for existence of \"assign\" statements in post synthesis Netlist."
            },
            {
                "question": "Are there any signal/pin not connected to any nets?"
            },
            {
                "question": "Is there any Master clock not reaching to the Generated clock?"
            },
            {
                "question": "For which modes SDC are getting used ?"
            },
            {
                "question": "Margin/Uncertainty used ?"
            },
            {
                "question": "Has Case analysis settings reviewed ?"
            },
            {
                "question": "Are all required reports and outputs generated?"
            },
            {
                "question": "Are there any overrides ?"
            },
            {
                "question": "Are there any errors/warnings in log file ?"
            },
            {
                "question": "Is Recommended fullchip size and shape used?"
            },
            {
                "question": "Is Site rows properly created?"
            },
            {
                "question": "Are there any overlaps between Macros, Sub blocks?"
            },
            {
                "question": "Are all Hard macro placement done according to guidelines?"
            },
            {
                "question": "Are there any macro placed out of core area?"
            },
            {
                "question": "Are all Macro positions fixed?"
            },
            {
                "question": "Are End cap cells placed?"
            },
            {
                "question": "Are Tap cells placed?"
            },
            {
                "question": "Are Spacing between IO pins and macros ,macro to macro done according to guidelines?"
            },
            {
                "question": "Are IO pin layers assigned properly?"
            },
            {
                "question": "Are IO pins on track?"
            },
            {
                "question": "Are utilizations ok?"
            },
            {
                "question": "Is FP / IO ring compatible with the decided package ?"
            },
            {
                "question": "Are all Macros aligned to manufacturing grid ?"
            },
            {
                "question": "Are Die-Dimensions according to DRM guidelines ?"
            },
            {
                "question": "Any  errors/ERROR observed ?"
            },
            {
                "question": "Are all Cells/Macros on grid ?"
            },
            {
                "question": "Are Blockages  placed on narrow channels ?"
            },
            {
                "question": "Are all Macro orientations proper ?"
            },
            {
                "question": "Are Clock ports locations Reviewed ?"
            },
            {
                "question": "Are Proper blockages created over and around  Hard macros?"
            },
            {
                "question": "Are all required reports and outputs generated?"
            },
            {
                "question": "Is Chip size and shape fixed?"
            },
            {
                "question": "Are IO PAD locations fixed?"
            },
            {
                "question": "Are all hard macros placement status is  fixed?"
            },
            {
                "question": "Are all blocks aligned to manufacturing grid?"
            },
            {
                "question": "Are IO fillers placed according to guidelines?"
            },
            {
                "question": "Are corner pads placed in correct orientation?"
            },
            {
                "question": "Is Base DRC clean ?"
            },
            {
                "question": "Is Scribe aware OD/PO fill done around IO ring?"
            },
            {
                "question": "Is IO Placement done according to given constraints ?"
            },
            {
                "question": "Are there any overrides ?"
            },
            {
                "question": "Are there any errors/warnings in log file ?"
            },
            {
                "question": "Are Ports and Pad placement done according to given constraints"
            },
            {
                "question": "Are bond PADs placed according to spec?"
            },
            {
                "question": "Is Bump placement done according to given constraints ?"
            },
            {
                "question": "Is RDL routing DRC clean ?"
            },
            {
                "question": "Is Recommended power grid spec used?"
            },
            {
                "question": "Are Power strap width and pitch as per guideline ?"
            },
            {
                "question": "Are global connections  defined correctly?"
            },
            {
                "question": "Are there any standard cells are placed below the straps?"
            },
            {
                "question": "Are there any dangling nets/vias present in design?"
            },
            {
                "question": "Are all macro PG pins and standard cell PG connected?"
            },
            {
                "question": "Are Decap cells placed?"
            },
            {
                "question": "Does IO and Core have separate grounds ?"
            },
            {
                "question": "If Yes for check 8, does IO ring have IO cells with b2b diodes between IO & core ground, inserted ?"
            },
            {
                "question": "Are IO & Core grounds shorted at Package level ?"
            },
            {
                "question": "Any  errors/ERROR observed ?"
            },
            {
                "question": "Number of power domains available ?"
            },
            {
                "question": "Are all power domains defined in UPF ?"
            },
            {
                "question": "Are all Low power cells inserted as per the requirement ?"
            },
            {
                "question": "Is Special power structure needed for any Macro ?"
            },
            {
                "question": "Metal layer used for std. cell power rail ?"
            },
            {
                "question": "Are there any PG shorts/ opens in the design?"
            },
            {
                "question": "Are all required reports and outputs generated?"
            },
            {
                "question": "Is power connecting  to all  IO PADs ?"
            },
            {
                "question": "Are there any errors/warnings in log file ?"
            },
            {
                "question": "Are there any overrides ?"
            },

        ]
    },
    {
        "stageName": 'Placement',
        "milestoneName": 'milestone_0.5',
        "checklistType": 'preChecklist',
        "questions": [
            {
                "question": "Is placement completed without any hotspots or congestion? (If any, please enter it in the comments)"
            },
            {
                "question": "Are there any cap, tran, setup violations? (If any please enter it in the comments)"
            },
            {
                "question": "Whether Standard cells are placed properly without any overlaps?"
            },
            {
                "question": "Are setup fixes done, Please mention the WNS, TNS and FEP, are they under control? (If any please enter it in the comments)"
            },

        ]
    },
    {
        "stageName": 'Placement',
        "milestoneName": 'milestone_0.8',
        "checklistType": 'preChecklist',
        "questions": [
            {
                "question": "Is placement finalized without any hotspots or congestion? (If any please enter it in the comments)"
            },
            {
                "question": "Are there any cap, tran, setup violations? (If any please enter it in the comments)"
            },
            {
                "question": "What are Skew and latency values after CTS?"
            },
            {
                "question": "Are setup fixes frozen, Please mention the WNS, TNS and FEP, are they under control? (If any please enter it in the comments)"
            },

        ]
    },
    {
        "stageName": 'Placement',
        "milestoneName": 'milestone_1.0',
        "checklistType": 'preChecklist',
        "questions": [
            {
                "question": "Placement commands and placement options were properly used ?"
            },
            {
                "question": "Are there any standard cells  placed within  soft / hard placement blockage ?"
            },
            {
                "question": "Are there any overlaps present between standard cells ?"
            },
            {
                "question": "Are there any congestion hotspots present  ?"
            },
            {
                "question": "Are check_place report and timing reports  clean ?"
            },
            {
                "question": "Is standard cell utilization acceptable ?"
            },
            {
                "question": "Are IO buffers added or not ?"
            },
            {
                "question": "Are there any missing TIE-HI and TIE-LO cells ?"
            },
            {
                "question": "Are there any cap, tran, setup violations ?"
            },
            {
                "question": "If Spare cells are not coming from RTL,  are they inserted through script ?  What is their percentage and have they been distributed evenly ?"
            },
            {
                "question": "Are there any Regioning and/or clustering done for flops to achieve  better timing/latency/skew ?"
            },
            {
                "question": "What is the congestion score ?"
            },
            {
                "question": "Are Antenna diodes  added to all the input pins for block design ?"
            },
            {
                "question": "What are the derates used ?"
            },
            {
                "question": "What is the uncertainty used ?"
            },
            {
                "question": "Spare cell inputs tied to 1/0 ?"
            },
            {
                "question": "Is the design checked for Don’t Use cells? If don’t use cells have been used, why ?"
            },
            {
                "question": "Are there any Cells outside the core area ?"
            },
            {
                "question": "Are there any Cell padding  added ?"
            },
            {
                "question": "Are there any instance  padding  added ?"
            },
            {
                "question": "Is HFNS ideal net attribute removed ?"
            },
            {
                "question": "Has Max fanout set properly ?"
            },
            {
                "question": "Is HFNS successful ?"
            },
            {
                "question": "Is Scan def read?  Scan chain opt enabled and Scan chain reordering is successful ?"
            },
            {
                "question": "Is Congestion map reviewed ? Any hotspots present ?"
            },
            {
                "question": "Are there any feedthroughs present ?"
            },
            {
                "question": "Is Clock gating cell placement optimal ?"
            },
            {
                "question": "Has Placement regions defined and validated ?"
            },
            {
                "question": "Is cell legality checked ?"
            },
            {
                "question": "Density map reviewed ? No local dense pockets ?"
            },
            {
                "question": "How much is the std cell utilization jump ? (pre place v/s post place)"
            },
            {
                "question": "Is LEC passing ?"
            },
            {
                "question": "Is CLP passing ?"
            },
            {
                "question": "Is Scan Chain Re-Ordering done?"
            },
            {
                "question": "Check whether hierarchical ports/nets preserved as required for DFT purpose"
            },
            {
                "question": "Is netlist verified with DFT team after scan reorder?"
            },
            {
                "question": "Is Check PG Connections done for all the cells ?"
            },
            {
                "question": "Is Check congestion, place density, pin density maps under control ?"
            },
            {
                "question": "Check whether all don't touch cells and nets preserved as required?"
            },
            {
                "question": "Are all required reports and outputs generated?"
            },
            {
                "question": "Are there any errors/warnings in the log file ?"
            },
            {
                "question": "Is Banking enabled? If Yes, Whether corresponding multi-bit cells present in library?"
            },
            {
                "question": "Are there any errors/warnings in the log file ?"
            },

        ]
    },
    {
        "stageName": 'CTS',
        "milestoneName": 'milestone_0.5',
        "checklistType": 'preChecklist',
        "questions": [
            {
                "question": "Are clock tree spec properly honoured in CTS? (If not please mention it in comment section.)"
            },
            {
                "question": "Is CTS completed with atleast 80% of CTS targets?"
            },
            {
                "question": "What are Skew and latency values after CTS?"
            },
            {
                "question": "Are setup fixes done, Please mention the WNS, TNS and FEP, are they under control? (If any please enter it in the comments)"
            },
            {
                "question": "Are Hold fixes done, Please mention the WNS, TNS and FEP, are they under control? (If any please enter it in the comments)"
            },

        ]
    },
    {
        "stageName": 'CTS',
        "milestoneName": 'milestone_0.8',
        "checklistType": 'preChecklist',
        "questions": [
            {
                "question": "Are clock tree spec properly honoured in CTS? (If not please mention it in comment section.)"
            },
            {
                "question": "Is CTS completed with finalized CTS targets?"
            },
            {
                "question": "What are Skew and latency values after CTS?"
            },
            {
                "question": "Are setup fixes frozen, Please mention the WNS, TNS and FEP, are they under control? (If any please enter it in the comments)"
            },
            {
                "question": "Are Hold fixes frozen, Please mention the WNS, TNS and FEP, are they under control? (If any please enter it in the comments)"
            },
        ]
    },
    {
        "stageName": 'CTS',
        "milestoneName": 'milestone_1.0',
        "checklistType": 'preChecklist',
        "questions": [
            {
                "question": "Are master clocks / generated clocks properly defined ?"
            },
            {
                "question": "Are all clocks synthesized ?"
            },
            {
                "question": "Are the clock buffers and inverters  inserted as per requirement  ?"
            },
            {
                "question": "Is  NDR  used for clock Routing ?"
            },
            {
                "question": "Is Skew and insertion delay met as per requirement ?"
            },
            {
                "question": "Is Logical DRCs (transition, capacitance, fanout, buffer levels ) met as per design requirements?"
            },
            {
                "question": "Are there any clock Exceptions ( stop pin , float pin, exclude pin, through pin) present ?"
            },
            {
                "question": "Is Standard cell utilization acceptable ?"
            },
            {
                "question": "Are layers used  to route the clock nets as per the design requirement ?"
            },
            {
                "question": "Are clock buffers added near all clock ports ?"
            },
            {
                "question": "Is Clock gating happened  as expected?"
            },
            {
                "question": "Are there any flops without clock ?"
            },
            {
                "question": "Values of skew and latency  after CTS ?"
            },
            {
                "question": "Is Timing analysis with OCV and crosstalk done ?"
            },
            {
                "question": "Are Hold timing fixes done ?"
            },
            {
                "question": "Are there any Setup slack observed?"
            },
            {
                "question": "Are there any Hold slack observed ?"
            },
            {
                "question": "What is the Uncertainty used ?"
            },
            {
                "question": "What is the derate value used ?"
            },
            {
                "question": "Is cell legality checked  ?"
            },
            {
                "question": "Set don’t touch attributes to Scan Chain and High Fanout Nets ?"
            },
            {
                "question": "Cells used for building clock tree (High and Low drive strength cells not used etc.)"
            },
            {
                "question": "Are there any non-clock buffer added in clock path ?"
            },
            {
                "question": "Are there any VT selection for building clock tree? Is only single VT used for clock tree ?"
            },
            {
                "question": "Are Clock shielding created ?"
            },
            {
                "question": "Are there any pulse width violation ?"
            },
            {
                "question": "Are there any Skew group created ?"
            },
            {
                "question": "Is useful Skew switch turned on (CCD option) ?"
            },
            {
                "question": "Are uncertainty value relaxed ? (Considering only Jitter)"
            },
            {
                "question": "Do all clocks have proper/expected number of sink points ?"
            },
            {
                "question": "Is Congestion map reviewed ? Any hotspots present ?"
            },
            {
                "question": "Is LEC passing ?"
            },
            {
                "question": "Is CLP passing ?"
            },
            {
                "question": "Is Hold Fix done? How many buffers added?"
            },
            {
                "question": "Are all required reports and outputs generated?"
            },
            {
                "question": "Are there any errors/warnings in the log file ?"
            },

        ]
    },
    {
        "stageName": 'Route',
        "milestoneName": 'milestone_0.5',
        "checklistType": 'preChecklist',
        "questions": [
            {
                "question": "Please check for the design routability"
            },
            {
                "question": "Are setup fixes done, Please mention the WNS, TNS and FEP, are they under control? (80% timing met) (If any please enter it in the comments)"
            },
            {
                "question": "What are Skew and latency values after routing ?"
            },
            {
                "question": "Are Hold fixes done, Please mention the WNS, TNS and FEP, are they under control?(80% timing met) (If any please enter it in the comments)"
            },
            {
                "question": "Are interface timing fixed keeping negative slack < 20% of the clock period?"
            },
            {
                "question": "Are DRC's, shorts, opens are under control? (Errors under 1000) (If any please enter it in the comments)"
            },
            {
                "question": "Are trails runs for IR done and are report analzyed?"
            },
            {
                "question": "Are trail runs done on signal and power EM  (If yes please mention problems in comment)"
            },

        ]
    },
    {
        "stageName": 'Route',
        "milestoneName": 'milestone_0.8',
        "checklistType": 'preChecklist',
        "questions": [

            {
                "question": "Please check for the design routability"
            },
            {
                "question": "Are setup fixes frozen, Please mention the WNS, TNS and FEP, are they under control? (90% timing met) (If any please enter it in the comments)"
            },
            {
                "question": "What are Skew and latency values after routing ?"
            },
            {
                "question": "Are Hold fixes frozen, Please mention the WNS, TNS and FEP, are they under control?(90% timing met) (If any please enter it in the comments)"
            },
            {
                "question": "Are interface timing fixed keeping negative slack < 10% of the clock period?"
            },
            {
                "question": "Are DRC's, shorts, opens are under control? (Errors under 200) (If any please enter it in the comments)"
            },
            {
                "question": "Are trails runs for IR frozen and are report analzyed?"
            },
            {
                "question": "Are signal and power EM fixed with +/-5% on top of EM limit (If yes please mention problems in comment)"
            },
        ]
    },
    {
        "stageName": 'Route',
        "milestoneName": 'milestone_1.0',
        "checklistType": 'preChecklist',
        "questions": [
            {
                "question": "Is design routable?"
            },
            {
                "question": "Are there any floating pins present?"
            },
            {
                "question": "Redundant via percentage ?"
            },
            {
                "question": "Are there any routing violations?"
            },
            {
                "question": "Are Antenna violation fixes done ?"
            },
            {
                "question": "What are Skew and latency values after routing ?"
            },
            {
                "question": "What is Worst slew observed in design?"
            },
            {
                "question": "What is the Standard cell utilization observed after routing?"
            },
            {
                "question": "What is Setup slack observed?"
            },
            {
                "question": "What is Hold slack observed?"
            },
            {
                "question": "What are the Uncertainties used ?"
            },
            {
                "question": "What are the Derates used ?"
            },
            {
                "question": "Number of shorts and opens observed ?"
            },
            {
                "question": "How many DRCs observed?"
            },
            {
                "question": "Does RC correlation exists between pre-route and post route ?"
            },
            {
                "question": "Are there hard tie to VDD/ VSS?"
            },
            {
                "question": "Are there nets in the design with fanout greater than 100 ?"
            },
            {
                "question": "Number of max trans, cap violations observed ?"
            },
            {
                "question": "Whether Via stacking/Via ladder enabled in flow?"
            },
            {
                "question": "Is LEC passing ?"
            },
            {
                "question": "Is CLP passing ?"
            },
            {
                "question": "Are all required reports and outputs generated?"
            },
            {
                "question": "Are there any errors/warnings in the log file ?"
            }
        ]
    }

]


module.exports = { designAuditorAllQuestions }