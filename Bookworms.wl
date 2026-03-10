(* ::Package:: *)

(* ::Section:: *)
(*Config*)


(* ::Input:: *)
(*$year=DateValue["Year"]*)


(* ::Section:: *)
(*Code:*)


(* ::Input:: *)
(*Clear[resultsGrid,results,resultsTimelinePlot]*)


(* ::Input:: *)
(*$pizza=Import["Images/pizza.m"];*)


(* ::Input:: *)
(*(* ResourceFunction["FirstWebImage"]["Ice Cream"] *)*)


(* ::Input:: *)
(*$icecream=Import["Images/icecream.m"]*)


(* ::Input:: *)
(*$t0=AbsoluteTime[DateObject[{2026,5,25},"Day"]]*)


(* ::Input:: *)
(*$tf=AbsoluteTime[DateObject[{2026,9,7},"Day"]]*)


(* ::Input:: *)
(*withLink[t_]:=Hyperlink[t,URL@URLBuild[<|"Scheme"->"https","User"->None,"Domain"->"www.goodreads.com","Port"->None,"Path"->{"","search"},"Query"->{"utf8"->"\[Checkmark]","q"->t,"search_type"->"books"},"Fragment"->None|>]]*)


(* ::Input:: *)
(*withAuthorLink[a_]:=Hyperlink[a,URL@URLBuild[<|"Scheme"->"https","User"->None,"Domain"->"www.goodreads.com","Port"->None,"Path"->{"","search"},"Query"->{"utf8"->"\[Checkmark]","q"->a,"search_type"->"books"},"Fragment"->None|>]]*)


(* ::Input:: *)
(*Clear[n,data]*)


(* ::Input:: *)
(*$root="Bookworms/"<>ToString[$year]<>"SummerChallenge";*)


(* ::Input:: *)
(*$dataco=CloudObject[FileNameJoin[{$root,"data"}]]*)


(* ::Input:: *)
(*$data=ReadList[$dataco]/.$Failed->{}*)


(* ::Input:: *)
(*Length[$data]*)


(* ::Input:: *)
(*Length@ReadList[$dataco]*)


(* ::Input:: *)
(*$statusPanel=With[{dco=$dataco,t0=$t0},*)
(*Framed[Panel[DynamicModule[{n=0},*)
(*Grid[{{*)
(*Style[ToString[$year]<>" Shawties Bookworms Reading Challenge","Title"]},*)
(*{Hyperlink["Add another book \[RightGuillemet]",URL@@CloudObject@FileNameJoin[{$root,"form"}]]},*)
(*{Style["Progress","Section"]},*)
(*{Style[Row[{"Books Read: ",*)
(*Dynamic[n=TimeConstrained[Length@ReadList[dco],1,0];""],Dynamic[n]}],24, FontFamily->"Source Sans Pro"]}*)
(**)
(**)
(*,*)
(**)
(*{EmbeddedHTML[CloudObject[FileNameJoin[{$root,"timelineplot.png"}]],ImageSize->{400,400}]},*)
(*{Style[Row[{Dynamic@QuantityMagnitude[n/UnitConvert[Quantity[AbsoluteTime[]-t0,"Seconds"],"Days"]]," books per day"}],16,FontFamily->"Source Sans Pro"]},*)
(*{Spacer[5]},*)
(*{Style["Book List","Section"]},*)
(*{Hyperlink[Style["See Full List \[RightGuillemet]", 20],URL@"fullresults"]},*)
(*{Style[Row[{$pizza,"Challenge"," ",Dynamic[*)
(*If[n>=100,*)
(*Style["Complete \[CheckmarkedBox]",Green],*)
(*""*)
(*]*)
(*]}],"Subsection"]},*)
(*{Dynamic@ProgressIndicator[(n)/100,ImageSize->Scaled[.5]]},{Row[{"Projected finish date: ",Dynamic[DateObject[First[t0+(t/.Solve[t*n/(AbsoluteTime[]-t0)==100,t])]],TrackedSymbols:>{},UpdateInterval->60]}]},*)
(*{EmbeddedHTML[CloudObject[FileNameJoin[{$root,"resultgrid1"}]],ImageSize->{400,300}]},*)
(*{Style[Row[{$icecream,"Bonus"," ",Dynamic[*)
(*If[n>=150,*)
(*Style["Complete \[CheckmarkedBox]",Green],*)
(*""*)
(*]*)
(*]}],"Subsection"]},*)
(*{Dynamic@ProgressIndicator[(n-100)/50,ImageSize->Scaled[.5]]},{Row[{"Projected finish date: ",Dynamic[DateObject[First[t0+t/.Solve[t*n/(AbsoluteTime[]-t0)==150,t]]],TrackedSymbols:>{},UpdateInterval->60]}]},*)
(*{EmbeddedHTML[CloudObject[FileNameJoin[{$root,"resultgrid2"}]],ImageSize->{400,300}]},*)
(*{Style[Row[{Style["???",24],"Double Bonus",Dynamic[*)
(*If[n>=200,*)
(*Style["Complete \[CheckmarkedBox]",Green],*)
(*""*)
(*]*)
(*]}],"Subsection"]},*)
(*{Dynamic@ProgressIndicator[(n-150)/50,ImageSize->Scaled[.5]]},{Row[{"Projected finish date: ",Dynamic[DateObject[First[t0+t/.Solve[t*n/(AbsoluteTime[]-t0)==200,t]]],TrackedSymbols:>{},UpdateInterval->60]}]},*)
(*{EmbeddedHTML[CloudObject[FileNameJoin[{$root,"resultgrid3"}]],ImageSize->{400,300}]},*)
(*{Style[Row[{Style["??????",24,Red, Italic],"Triple Bonus",Dynamic[*)
(*If[n>=300,*)
(*Style["Complete \[CheckmarkedBox]",Green],*)
(*""*)
(*]*)
(*]}],"Subsection"]},*)
(*{Dynamic@ProgressIndicator[(n-200)/50,ImageSize->Scaled[.5]]},{Row[{"Projected finish date: ",Dynamic[DateObject[First[t0+t/.Solve[t*n/(AbsoluteTime[]-t0)==300,t]]],TrackedSymbols:>{},UpdateInterval->60]}]},*)
(*{EmbeddedHTML[CloudObject[FileNameJoin[{$root,"resultgrid4"}]],ImageSize->{400,1100}]},*)
(*{Row[{Hyperlink["2024 \[RightGuillemet]",URL["https://www.wolframcloud.com/obj/bobs/Bookworms/2024SummerChallenge/status"]],*)
(*" | ",Hyperlink["2023 \[RightGuillemet]",URL["https://www.wolframcloud.com/obj/bobs/Bookworms/2023SummerChallenge/status"]]}]}*)
(**)
(**)
(**)
(*},Alignment->Center]*)
(*],BaseStyle->{16,FontFamily->"Source Sans Pro"},Background->None],RoundingRadius->5]*)
(*];*)


(* ::Input:: *)
(*resultsTimelinePlot[data_]:=Graphics[]/;Length[data]<2*)


(* ::Input:: *)
(*resultsTimelinePlot[data_,sizes_]:=With[{sorted=SortBy[data,AbsoluteTime[#Timestamp]&], n=Length[data]},*)
(*DateListPlot[Module[{first=True},*)
(*Table[If[n>=Echo[cutoff][[1]],*)
(*If[first,(first=False;Prepend[{$t0,0}][#])&,Identity][Echo@MapIndexed[Tooltip[{#1["Timestamp"],#2[[1]]},#1["Title"]]&,Take[sorted,{cutoff[[1]],UpTo[cutoff[[2]]]}]]],*)
(*Nothing*)
(*],*)
(*{cutoff,Transpose[{Prepend[sizes,1],Append[sizes,Length[data]]}]}*)
(*]*)
(**)
(*],*)
(**)
(*PlotRange->{{Min[{$t0,AbsoluteTime@sorted[[1,"Timestamp"]]}],$tf},{0,Max[{Length[data]*1.5,200}]}},ImageSize->Scaled[.7],Epilog->{Red,Text["Pizza",{$t0,105},{-1,0}],Line[{{$t0,100},{$tf,100}}],*)
(*Blue,Text["Ice Cream",{$t0,155},{-1,0}],Line[{{$t0,150},{$tf,150}}]}*)
(**)
(**)
(**)
(*]*)
(*]*)


(* ::Input:: *)
(*resultsTimelinePlot[data_]:=DateListStepPlot[{Prepend[Thread[Tooltip[Transpose[{NumericalSort@Lookup[data[[;;100]],"Timestamp"],Range[100]}],Lookup[data[[;;100]],"Title"]]],{$t0,0}],*)
(*Thread[Tooltip[Transpose[{NumericalSort@Lookup[data[[101;;]],"Timestamp"],Range[101,Length[data]]}],Lookup[data[[101;;]],"Title"]]]},PlotRange->{{Min[{$t0,AbsoluteTime@data[[1,"Timestamp"]]}],$tf},{0,Max[{Length[data]*1.5,200}]}},ImageSize->Scaled[.7],PlotLabels->{Placed["Pizza",{data[[100,"Timestamp"]],Below}],Placed["Ice Cream",{data[[150,"Timestamp"]],Below}]}]/;Length[data]>150*)


(* ::Input:: *)
(*resultsTimelinePlot[data_]:=DateListStepPlot[{Prepend[*)
(**)
(**)
(*Thread[Tooltip[Transpose[{NumericalSort@Lookup[data[[;;100]],"Timestamp"],Range[100]}],Lookup[data[[;;100]],"Title"]]],{DateObject@$t0,0}],*)
(*Thread[Tooltip[Transpose[{NumericalSort@Lookup[data[[101;;]],"Timestamp"],Range[101,Length[data]]}],Lookup[data[[101;;]],"Title"]]]},PlotRange->{{Min[{$t0,AbsoluteTime@data[[1,"Timestamp"]]}],$tf},{0,200}},ImageSize->Scaled[.7],PlotLabels->{Placed["Pizza",{data[[100,"Timestamp"]],Below}]},*)
(*Epilog->Epilog->{*)
(*Blue,Text["Ice Cream",{$t0,155},{-1,0}],Line[{{$t0,150},{$tf,150}}]}*)
(*]/;Length[data]>100*)


(* ::Input:: *)
(*resultsTimelinePlot[data_]:=DateListStepPlot[{Prepend[*)
(**)
(**)
(*Thread[Tooltip[Transpose[{NumericalSort@Lookup[data,"Timestamp"],Range[Length[data]]}],Lookup[data,"Title"]]],{$t0,0}]},PlotRange->{{Min[{$t0,AbsoluteTime@data[[1,"Timestamp"]]}],$tf},{0,200}},ImageSize->Scaled[.7],*)
(*Epilog->{Red,Text["Pizza",{$t0,105},{-1,0}],Line[{{$t0,100},{$tf,100}}],*)
(*Blue,Text["Ice Cream",{$t0,155},{-1,0}],Line[{{$t0,150},{$tf,150}}]}*)
(*]*)


(* ::Input:: *)
(*resultsTimelinePlot2[data_]:=DateListStepPlot[{Prepend[*)
(**)
(**)
(*Thread[Tooltip[Transpose[{NumericalSort@Lookup[data,"Timestamp"],Range[Length[data]]}],Lookup[data,"Title"]]],{$t0,0}]},PlotRange->{{Min[{$t0,AbsoluteTime@data[[1,"Timestamp"]]}],$tf},Automatic},ImageSize->Scaled[.4]*)
(*]*)


(* ::Input:: *)
(*opts={Alignment->Left,Dividers->{{True,{False},True},All},Spacings->1,BaseStyle->{FontFamily->"Source Sans Code"}};*)


(* ::Input:: *)
(*entryLink[n_]:=Hyperlink[n,URLBuild[CloudObject@FileNameJoin[{$root,"entry"}],{"n"->n}]]*)


(* ::Input:: *)
(*$Headers={*)
(*	WebItem["", Bold],*)
(*	WebItem["Reader",Bold],*)
(*	WebItem["Title",Bold],*)
(*	WebItem[""],*)
(*	WebItem["Author",Bold],*)
(*	WebItem["\[Star]",Bold, FontSize->Large],*)
(*	WebItem["Date",Bold],*)
(*	WebItem["Pages",Bold],*)
(*	WebItem["Medium",Bold],*)
(*	WebItem["Suggestor",Bold],*)
(*	WebItem["Comment",Bold]*)
(*};*)


(* ::Input:: *)
(*Clear[resultsGridWebItem,resultsGridWebItemRow];*)
(*resultsGridWebItem[data_, n_Integer, m_:10]:=resultsGridWebItem[data, {n,0}, m]*)


(* ::Input:: *)
(*resultsGridWebItem[data_, {n_,offset_}, m_:10]:=*)
(*	ExportString[Grid[Prepend[MapIndexed[resultsGridWebItemRow[#1,#2+offset,m]&,PadRight[data,n,<||>]],*)
(*Take[$Headers,m]]],"HTMLFragment"]*)


(* ::Input:: *)
(*resultsGridWebItemRow[entry_, {i_},m_:10]:=*)
(*	Take[{*)
(*	WebItem[entryLink[i]],*)
(*	WebItem[Lookup[entry,"Reader",""]],*)
(*	WebItem[withLink@Lookup[entry,"Title",""]],*)
(*	If[KeyExistsQ[entry,"Author"],WebItem["by"],WebItem[""]],*)
(*	WebItem[withAuthorLink@Lookup[entry,"Author",""], Italic],*)
(*	WebItem[Lookup[entry,"Stars",""],Bold,FontSize->Small],*)
(*	WebItem[Lookup[entry,"Timestamp",""]/.{(expr:Except[""]):>DateString[expr,{"MonthShort","/","DayShort"}]}],*)
(*	WebItem[Lookup[entry,"Pages",""]],*)
(*	WebItem[Lookup[entry,"Medium",""]],*)
(*	WebItem[Lookup[entry,"Suggestor",""]],*)
(*	WebItem[Lookup[entry,"Comment",""]]*)
(*},m]*)


(* ::Input:: *)
(*formatStars[n_]:=ToString[n]<>"\[Star]"*)


(* ::Section:: *)
(*Deployment*)


(* ::Input:: *)
(*BOB[]*)


(* ::Input:: *)
(*$dataco*)


(* ::Input:: *)
(*ReadList[$dataco]*)


(* ::Input:: *)
(*$root*)


(* ::Input:: *)
(*rawpath=FileNameTake[$dataco,-3]*)


(* ::Input:: *)
(*CreateDirectory[CloudObject[FileNameDrop[rawpath]]]*)


(* ::Input:: *)
(*(*CloudPut[{},$dataco];*)
(*CloudEvaluate[Put[Sequence@@$data,rawpath]] *)*)


(* ::Input:: *)
(*entryapi = CloudDeploy[APIFunction[{"n" -> "Integer"}, *)
(*WebColumn[WebRow/@Prepend[Delete[Transpose[{Append[100]/@$Headers,resultsGridWebItemRow[ReadList[$dataco][[#n]],{1},11]}],{{1},{4}}],WebItem[#n,100,Bold,FontSize->48]]] & ], *)
(*   FileNameJoin[{$root, "entry"}], Permissions -> "Public"]*)


(* ::Input:: *)
(*SystemOpen@URLBuild[entryapi,{"n"->2}]*)


(* ::Input:: *)
(*CloudDeploy[FormFunction[{"Reader" -> "String",*)
(* "Title" -> "String",*)
(*"Author"->"String",*)
(*{"Timestamp","Finished On"}-><|"Interpreter"->"Date","Input":>DateString@Today|>,*)
(*{"Stars","Rating (optional; 5 is good)"}->{None,1,2,3,4,5},*)
(*{"Pages","Page Count (optional)"}-><|"Interpreter"->"Integer","Default"->Missing[],"Required"->False|>,*)
(*"Medium"-><|"Interpreter"->{"It's a secret","Paper","Audio","eBook","Other?"}|>, *)
(*{"Genre","Genre (optional)"}-><|"Interpreter"->"String","Default"->"","Required"->False|>,*)
(*{"Suggestor","Shawtie Recommendor (optional)"}-><|"Interpreter"->"String","Default"->"","Required"->False|>,*)
(*{"Comment","Comment/Review (optional)"}-><|"Interpreter"->"TextArea","Default"->"","Required"->False|>},*)
(*   (PutAppend[Append[#1, "Timestamp" -> Now], $dataco]; *)
(*     HTTPRedirect[CloudObject[FileNameJoin[{$root,"status"}]]]) & ], *)
(*FileNameJoin[{$root,"form"}], Permissions -> "Public"]*)


(* ::Input:: *)
(*CloudDeploy[Delayed[ExportForm[Image[resultsTimelinePlot[ReadList[$dataco]],ImageSize->{400,400}],"PNG"]],FileNameJoin[{$root,"timelineplot.png"}],Permissions->"Public"]*)


(* ::Input:: *)
(*DeleteObject[CloudObject@FileNameJoin[{$root,"status"}]];*)


(* ::Input:: *)
(*nbo=CreateDocument[$statusPanel];*)
(*nb=NotebookGet[nbo];*)
(*NotebookClose[nbo];*)


(* ::Input:: *)
(*SystemOpen@Echo@CloudDeploy[nb,FileNameJoin[{$root,"status"}],Permissions->"Public"];*)
(*NotebookClose[nbo];*)


(* ::Subsubsection:: *)
(*Grids*)


(* ::Input:: *)
(*DeleteObject@*CloudObject@*(FileNameJoin[{$root,#}]&)/@{"resultgrid1","resultgrid2","resultgrid3"}*)


(* ::Input:: *)
(*CloudDeploy[Delayed[With[{data=ReadList[$dataco]},*)
(*resultsGridWebItem[data,Length[data]]*)
(*]*)
(*],FileNameJoin[{$root,"fullresults"}],Permissions->"Public"]*)


(* ::Input:: *)
(*$narrowgridwidth=6;*)


(* ::Input:: *)
(**)


(* ::Input:: *)
(*CloudDeploy[Delayed[resultsGridWebItem[Take[ReadList[$dataco],UpTo[100]],100,$narrowgridwidth]],FileNameJoin[{$root,"resultgrid1"}],Permissions->"Public"]*)


(* ::Input:: *)
(*CloudDeploy[Delayed[resultsGridWebItem[With[{data=ReadList[$dataco]},*)
(*If[Length[data]>100,*)
(*Take[data[[101;;]],UpTo[50]],{}*)
(*]*)
(*],{50,100},$narrowgridwidth]*)
(*],FileNameJoin[{$root,"resultgrid2"}],Permissions->"Public"]*)


(* ::Input:: *)
(*CloudDeploy[Delayed[resultsGridWebItem[With[{data=ReadList[$dataco]},*)
(*If[Length[data]>150,*)
(*Take[data[[151;;]],UpTo[50]],{}*)
(*]*)
(*],{50,150},$narrowgridwidth]*)
(*],FileNameJoin[{$root,"resultgrid3"}],Permissions->"Public"]*)


(* ::Input:: *)
(*CloudDeploy[Delayed[resultsGridWebItem[With[{data=ReadList[$dataco]},*)
(*If[Length[data]>200,*)
(*Take[data[[201;;]],UpTo[100]],{}*)
(*]*)
(*],{100,200},$narrowgridwidth]*)
(*],FileNameJoin[{$root,"resultgrid4"}],Permissions->"Public"]*)
