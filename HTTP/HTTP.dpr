program HTTP;

uses
  Forms,
  U_HTTP in 'U_HTTP.pas' {Form1};

{$R *.RES}

begin
  Application.Initialize;
  Application.CreateForm(TForm1, Form1);
  Application.Run;
end.
