unit U_HTTP;

interface

uses
  Windows, Messages, SysUtils, Classes, Graphics, Controls, Forms, Dialogs,
  StdCtrls, IdBaseComponent, IdComponent, IdTCPConnection, IdTCPClient,
  IdHTTP;

type
  TForm1 = class(TForm)
    IdHTTP1: TIdHTTP;
    Label1: TLabel;
    bGet: TButton;
    bPost: TButton;
    eTemps: TEdit;
    Label2: TLabel;
    Label3: TLabel;
    procedure bGetClick(Sender: TObject);
    procedure bPostClick(Sender: TObject);
  private
    { Déclarations privées }
  public
    { Déclarations publiques }
  end;

var
  Form1: TForm1;

implementation

{$R *.DFM}

procedure TForm1.bGetClick(Sender: TObject);
var //HTTP: TIdHTTP;
    reponse: TStringStream;
    lOk: boolean;

    function lireTemps (json: string): integer;
    // lit un INTEGER à partir d'une structure JSON
    const cle = '"temps":';
    var
       P, P_fin1, P_fin2, P_fin_min: Integer;
    begin
         // Exemple rudimentaire de parsing
         Result := -1;
         P := Pos(cle, json);
         if P > 0 then
         begin
              //Delete(S, 1, P + 9);

              P_fin1 := Pos(',', json);
              P_fin2 := Pos('}', json);

              if (P_fin1 <= P_fin2) and (P_fin1 <> 0) then
                 P_fin_min := P_fin1
              else
                 P_fin_min := P_fin2;

              Result := StrToInt( Copy(json, P + length(cle), P_fin_min - (P + length(cle))) );
         end;
    end;

begin
     lOk := False;
     reponse := TStringStream.Create('');
     try
        IdHTTP1.Request.Accept := 'application/json';
        IdHTTP1.Request.ContentType := 'application/json';
        IdHTTP1.Request.UserAgent := 'Delphi5-Client';
        IdHTTP1.Get('http://127.0.0.1:8000/api/temps/anes', reponse);
        //showmessage(reponse.DataString);
        //
        label1.Caption := IntToStr(lireTemps(reponse.DataString));
        lOk := True;
     except
           on E: Exception do showmessage(E.Message);
     end;
     reponse.Free;

     if not lOk then
        label1.Caption := 'pb';
end;

procedure TForm1.bPostClick(Sender: TObject);
var DataStream: TMemoryStream;
    JSON: string;
    lOk: boolean;
begin
     lOk := False;
     DataStream := TMemoryStream.Create;
     try
        JSON := '{"utilisateur": "anes", "temps": '+eTemps.Text+'}';
        DataStream.Write(Pointer(JSON)^, Length(JSON));
        DataStream.Position := 0;

        IdHTTP1.Request.Accept := 'application/json';
        IdHTTP1.Request.ContentType := 'application/json';
        IdHTTP1.Request.UserAgent := 'Delphi5-Client';
        IdHTTP1.Post('http://127.0.0.1:8000/api/majtemps', DataStream);
        lOk := True;
     except
           on E: Exception do showmessage(E.Message);
     end;
     DataStream.Free;

     if lOk then label2.caption := 'Ok'
     else label2.caption := 'pb';
end;

end.
